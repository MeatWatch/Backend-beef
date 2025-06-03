# 📘 Meatwatch - Dokumentasi Backend API
___
## 📄 Ringkasan
MeatWatch API adalah layanan backend yang mendukung manajemen autentikasi pengguna melalui fitur login dan registrasi, penyimpanan data hasil klasifikasi pengguna ke dalam database secara efisien, serta pengiriman pengingat atau reminder otomatis melalui email. API ini dirancang untuk memberikan pengalaman yang aman, responsif, dan terintegrasi dengan teknologi pembelajaran mesin untuk klasifikasi produk daging.  
**Versi: 1.0.0.**
### 🔒 Metode Autentikasi
- **Token-Based Authentication**
___
## 🧰 Teknologi dan Dependensi

| Package / Library | Keterangan                                                 |
| ----------------- | ---------------------------------------------------------- |
| **express**       | Web framework utama untuk membangun REST API               |
| **mysql2**        | Library untuk koneksi dan query database MySQL             |
| **bcryptjs**      | Untuk melakukan hashing dan verifikasi password            |
| **jsonwebtoken**  | Mengelola autentikasi berbasis token (JWT)                 |
| **multer**        | Mendukung upload file (gambar daging & profil)             |
| **dotenv**        | Mengelola konfigurasi berbasis file `.env`                 |
| **cors**          | Mengizinkan permintaan lintas domain                       |
| **nanoid**        | Membuat ID unik untuk entitas seperti user dan klasifikasi |
| **nodemailer**    | Mengirim email notifikasi/reminder otomatis                |
| **node-cron**     | Menjadwalkan tugas otomatis seperti reminder berkala       |
| **dayjs**         | Mengelola dan format tanggal lebih ringkas dan efisien     |
| **nodemon**       | Auto-restart server selama pengembangan (development only) |

___

## 📥 Instalasi
> ⚠️ **CATATAN :** Pastikan menjalankan perintah instalasi di atas sebelum menggunakan API.
``` bash
npm install
```
### 📋 Prasyarat
Sebelum memulai, pastikan perangkat lunak berikut telah terinstal dan siap digunakan pada sistem anda:
- **NodeJS** (Versi 18 atau lebih tinggi)
- **NPM** (Node Package Manager)
___

## 🔗 Endpoint API
### 🔑 1. Endpoint Autentifikasi

#### ✍️ Register User `(POST)`
- **📌 Endpoint :** `/users/register`
- **📨 Request Body :** 
``` json
{
    "username": "<nama anda>",
    "email": "<email anda>",
    "password": "<password unik>"
}
```

| Nama Kolom | Tipe Data  | Keterangan                                     |
|------------|------------|------------------------------------------------|
| username   | string     | Nama pengguna                                  |
| email      | string     | Email unik yang valid, pastikan email aktif    |
| password   | string     | Minimal 6 karakter, akan di-*hash* secara aman |

- **✅ Response :**
``` json
{
    "success": true,
    "message": "CREATE new users success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiZjFZYl.iW2Rj2nulNf",
    "user": {
        "name": "Syuhada Aqlul Hafiz",
        "email": "suhafis23@gmail.com"
    }
}
```

#### 🔓 Login User `(POST)`
- **📌 Endpoint :** `/users/login`
- **📨 Request Body :** 
``` json
{
    "identifier": "<email atau username terdaftar>",
    "password": "<password terdaftar>"
}
```
| Nama Kolom | Tipe Data   | Keterangan                               |
|------------|-------------|------------------------------------------|
| identifier | string      | Email atau username yang terdaftar       |
| password   | string      | Password anda yang terdaftar             |
> ⚠️ **Catatan :** Identifier adalah email dan username yang di input user pada saat login

- **✅ Response :**
``` json
{
    "success": true,
    "message": "Login Successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiZjFZYlhoc1h4Iilna",
    "user": {
        "userId": "bf1YbXhsXx",
        "email": "suhafis23@gmail.com",
        "no_telp": null,
        "username": "Syuhada Aqlul",
        "profile_picture": null,
        "address": null,
        "created_at": "2025-06-02T05:42:00.000Z",
        "updated_at": "2025-06-02T05:59:37.000Z",
        "last_login": "2025-06-02T05:59:37.000Z"
    }
}
```
> ⚠️ **Catatan :** Data yang bernilai null dapat di update di edit profile

### 👤 2. Endpoint User
#### 👥 Get All User `GET`
- **📌 Endpoint :** `/users`
- **✅ Response :**
``` json
{
    "message": "GET all users success",
    "data": [
        {
            "userId": "5Igft0liVQ",
            "email": "User1@gmail.com",
            "no_telp": "+6289516420190",
            "username": "User1",
            "password": "$2b$10$PUdF4v48.IZAblgS.Wl5NecgR3dsbyFhg5wQs9vXfr/lv3CmF7RZK",
            "profile_picture": "1748885161672-user1.jpg",
            "address": "Bogor",
            "created_at": "2025-06-02T10:26:54.000Z",
            "updated_at": "2025-06-02T10:34:55.000Z",
            "last_login": "2025-06-02T10:34:55.000Z"
        },
        {
            "userId": "msvUuqxCiO",
            "email": "user2@gmail.com",
            "no_telp": "089716527156",
            "username": "user2",
            "password": "$2b$10$Mm26xhdzPTCY4s3OPP9cou2Ogw98vTkz1aatQnTlDIT1fFtKvyP8O",
            "profile_picture": "1748885165286-user2.jpg",
            "address": "Jakarta",
            "created_at": "2025-06-02T10:25:36.000Z",
            "updated_at": "2025-06-02T17:26:05.000Z",
            "last_login": "2025-06-02T10:25:44.000Z"
        }
    ]
}
```

#### 🆔 Get User By User Id `GET`
- **📌 Endpoint :** `/users/profile`
- **📬 Headers :**
  - `Authorization: Bearer <token>`
- **✅ Response :**
``` json
{
    "success": true,
    "message": "Success get user by id",
    "user": {
        "userId": "5Igft0liVQ",
        "email": "user1@gmail.com",
        "no_telp": "089516420190",
        "username": "User1",
        "password": "$2b$10$PUdF4v48.IZAblgS.Wl5NecgR3dsbyFhg5wQs9vXfr/lv3CmF7RZK",
        "profile_picture": "1748885161672-user1.jpg",
        "address": "Bojonggede",
        "created_at": "2025-06-02T10:26:54.000Z",
        "updated_at": "2025-06-02T21:29:10.000Z",
        "last_login": "2025-06-02T21:29:10.000Z"
    }
}
```

#### 📝 Update User `PATCH`
- **📌 Endpoint :** `/users/profile`
- **📬 Headers :**
  - `Content-Type: multipart/form-data`
  - `Authorization: Bearer <token>`
- **📨 Request Body :**

| Field Name       | Tipe Data | Keterangan                      |
|------------------|-----------|---------------------------------|
| `email`          | string    | Email Aktif                     |
| `no_telp`        | string    | Nomor telepon                   |
| `username`       | string    | Username                        |
| `address`        | string    | Alamat                          |
| `profile_picture`| file      | Foto profil yang diupload       |

> **Catatan :** Semua data yang dikirim dalam permintaan pembaruan bersifat opsional; hanya field yang disertakan yang akan diperbarui
- **✅ Response :**
``` json
{
    "success": true,
    "message": "Update Success",
    "user": {
        "userId": "5Igft0liVQ",
        "email": "User2@gmail.com",
        "no_telp": "089516420191",
        "username": "User2",
        "password": "$2b$10$PUdF4v48.IZAblgS.Wl5NecgR3dsbyFhg5wQs9vXfr/lv3CmF7RZK",
        "profile_picture": "1748925998079-user2.png",
        "address": "Bogor",
        "created_at": "2025-06-02T10:26:54.000Z",
        "updated_at": "2025-06-03T04:46:38.000Z",
        "last_login": "2025-06-02T21:29:10.000Z"
    }
}
```

### 3. 🥩 Endpoint Klasifikasi Daging
#### 📚 Get All Classification `GET`
- **📌 Endpoint :** `/classifications`
- **✅ Response :**
``` json
{
    "success": true,
    "message": "GET all classfication by user id success",
    "data": [
        {
            "classifyId": "-bKvJH7-QV",
            "userId": "5Igft0liVQ",
            "meat_type": "chicken",
            "status": "Segar",
            "confidence": "0.52",
            "image_beef": "images\\classification\\1748885448300-meat-image.jpg",
            "createdAt": "2025-06-02T17:30:48.000Z"
        },
        {
            "classifyId": "mQcJf5bNbq",
            "userId": "msvUuqxCiO",
            "meat_type": "beef",
            "status": "Tidak Segar",
            "confidence": "0.99",
            "image_beef": "images\\classification\\1748885183278-meat-image.jpg",
            "createdAt": "2025-06-02T17:26:23.000Z"
        }
    ]
}
```

#### 🗂️ Get All Classify By User Id `GET`
- **📌 Endpoint :** `/classifications/history`
- **📬 Headers :**
  - `Authorization: Bearer <token>`
- **✅ Response :**
``` json
{
    "success": true,
    "message": "GET all classification with userId: 5Igft0liVQ",
    "data": [
        {
            "classifyId": "-bKvJH7-QV",
            "userId": "5Igft0liVQ",
            "meat_type": "chicken",
            "status": "Segar",
            "confidence": "0.52",
            "image_beef": "images\\classification\\1748885448300-meat-image.jpg",
            "createdAt": "2025-06-02T17:30:48.000Z",
            "reminderDate": "2025-06-05T17:30:48.000Z"
        },
        {
            "classifyId": "LGkS97UW3Q",
            "userId": "5Igft0liVQ",
            "meat_type": "beef",
            "status": "Segar",
            "confidence": "0.52",
            "image_beef": "images\\classification\\1748927732128-meat-image.jpg",
            "createdAt": "2025-06-03T05:15:32.000Z",
            "reminderDate": "2025-06-06T05:15:32.000Z"
        }
    ]
}
```

#### 📚 Add Classification `POST`
- **📌 Endpoint :** `/classifications`
- **📬 Headers :**
  - `Content-Type: multipart/form-data`
  - `Authorization: Bearer <token>`
- **📨 Request Body :**

| Field Name    | Tipe Data | Keterangan                      |
|---------------|-----------|---------------------------------|
| `meat_type`   | string    | Tipe daging                     |
| `status`      | string    | Status kesegaran                |
| `confidence`  | string    | Tingkat kepercayaan klasifikasi |
| `image_beef`  | file      | Foto daging yang di upload      |

> **Catatan :** Informasi mengenai tingkat kesegaran dan tingkat kepercayaan diperoleh dari hasil prediksi model machine learning
- **✅ Response :**
``` json
{
    "success": true,
    "message": "POST Success",
    "result": {
        "classifyId": "eG5NVll-ED",
        "userId": "5Igft0liVQ",
        "meat_type": "beef",
        "status": "Segar",
        "confidence": "0.92",
        "image_beef": "images\\classification\\1748930013815-daging_sapi.jpg",
        "createdAt": "2025-06-03T05:53:33.000Z"
    }
}
```
___












