import dotenv from "dotenv";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js'; 
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { deleteClassificationById, getClassifyByClassifyId } from "../models/classificationModel.js"
import { deleteReminderByIsReminder, getDataForReminder, updateIsReminder } from '../models/reminderModel.js';

dotenv.config();
dayjs.extend(utc);
dayjs.extend(timezone);

// Konfigurasi transporter email
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.APP_PASSWORD_EMAIL,
    }
});

// Create reminder date
export const createReminderDate = async (id) => {
    const [rows] = await getClassifyByClassifyId(id);

    if (rows.length === 0) {
        throw new Error("Classification not found");
    }
    
    const createdAt = dayjs().tz('Asia/Jakarta');
    let reminderDate;
    
    const meat = rows[0];
    const freshness = (meat.status ?? '').trim().toLowerCase();
    const score = meat.confidence;

    // logika reminder
    if (freshness === 'segar') {
        if (score >= 90) {
            reminderDate = createdAt.add(7, 'day');
        } else if (score >= 70) {
            reminderDate = createdAt.add(5, 'day');
        } else if (score >= 50) {
            reminderDate = createdAt.add(3, 'day');
        } else if (score < 50) {
            reminderDate = createdAt.add(2, 'day');
        }
    } else if (freshness === 'tidak segar') {
        if (score >= 90) {
            reminderDate = createdAt.add(1, 'day');
        } else if (score >= 70) {
            reminderDate = createdAt.add(2, 'day');
        } else if (score >= 50) {
            reminderDate = createdAt.add(4, 'day');
        } else if (score < 50) {
            reminderDate = createdAt.add(5, 'day');
        }
    } else {
        throw new Error(`Status freshness tidak valid: ${freshness}`);
    }

    return reminderDate.format('YYYY-MM-DD HH:mm:ss');
}

// penjadwalan reminder melalui email
export const reminderJob = cron.schedule('* * * * *', async () => {
    const now = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const [rows] = await getDataForReminder(now);
    
    if (rows.length > 0) {
        for (const data of rows) {
            const createdAtWIB = dayjs.utc(data.createdAt).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

            const mailOptions = {
                from: 'MEATWATCH',
                to: data.email,
                subject: "⚠️ Daging Anda Perlu Segera Digunakan!",
                html: `
                  <p style="text-transform: uppercase;"><b>hallo, ${data.username}</b></p>
                  <p>Kami ingin mengingatkan bahwa berdasarkan hasil klasifikasi terakhir dari aplikasi <em>MeatWatch</em>, daging yang Anda unggah terdeteksi dalam kondisi <strong>tidak segar</strong>.</p>
                  <p>Demi menjaga kesehatan dan kualitas makanan Anda, kami sarankan untuk segera mengolah atau menggunakan daging tersebut hari ini.</p>
                  <p><strong>Detail:</strong><br/>
                  🥩 Jenis Daging: ${data.meat_type}<br/>
                  📅 Tanggal Klasifikasi: ${createdAtWIB} WIB</p>
                  <p>Jika daging tidak segera digunakan, sebaiknya dibuang untuk menghindari risiko kesehatan.</p>
                  <b>Terima kasih telah menggunakan MeatWatch!<br/>
                  Salam sehat,<br/>
                  Tim MeatWatch</b>
                `
            }

            try {
                await new Promise((resolve, reject) =>  {
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) return reject(error);

                        console.log(`Email sent: ${info.messageId}`);
                        resolve();
                    });
                });
                await updateIsReminder(data.reminderId);
                await deleteClassificationById(data.classifyId);
            } catch (error) {
                console.log(error);
            }
        }
    }
    await deleteReminderByIsReminder();
}, {
  scheduled: true,
});