import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js'; 
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { deleteClassificationById, getClassifyByClassifyId } from "../models/classificationModel.js"
import { deleteReminderByIsReminder, getDataForReminder, updateIsReminder } from '../models/reminderModel.js';

export const createReminderDate = async (id) => {
    const [rows] = await getClassifyByClassifyId(id);

    if (rows.length === 0) {
        throw new Error("Classification not found");
    }
    
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const createdAt = dayjs().tz('Asia/Jakarta');
    let reminderDate;
    
    const meat = rows[0];
    const freshness = meat.confidence;
    
    if (freshness >= 90) {
        reminderDate = createdAt.add(1, 'minute');
    } else if (freshness >= 80) {
        reminderDate = createdAt.add(3, 'minute');
    } else if (freshness >= 70) {
        reminderDate = createdAt.add(5, 'day');
    } else if (freshness >= 60) {
        reminderDate = createdAt.add(4, 'day');
    } else if (freshness >= 50) {
        reminderDate = createdAt.add(3, 'day');
    } else if (freshness >= 40) {
        reminderDate = createdAt.add(2, 'day');
    } else if (freshness < 40) {
        reminderDate = createdAt.add(1, 'day');
    }

    return reminderDate.format('YYYY-MM-DD HH:mm:ss');
}

export const reminderJob = cron.schedule('* * * * *', async () => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const now = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const [rows] = await getDataForReminder(now);
    console.log('reminderRows:', rows);
    console.log(now);
    
    if (rows.length > 0) {
        const data = rows[0];
        const createdAtWIB = dayjs.utc(data.createdAt).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "meatwatchcc25cf130@gmail.com",
                pass: "suecmmkwdtmlgoze",
            }
        });

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

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            console.log(`Email sent: ${info.messageId}`);
        });

        await updateIsReminder(data.reminderId);
        await deleteReminderByIsReminder();
        await deleteClassificationById(data.classifyId);
    }
}, {
  scheduled: false,
});