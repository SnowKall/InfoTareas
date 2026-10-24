// api/send-notification.js
const webpush = require('web-push');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { subscription, tareaTitulo, cursoNombre, hora } = req.body;

        // Configuración de llaves VAPID para notificaciones Push
        webpush.setVapidDetails(
            process.env.MY_EMAIL,
            process.env.VAPID_PUBLIC_KEY,
            process.env.PRIVATE_VAPID_KEY
        );

        const payload = JSON.stringify({
            title: `📌 Recordatorio: ${tareaTitulo}`,
            body: `La tarea del curso ${cursoNombre} vence a las ${hora}.`,
            icon: '/IMG/Icons/AllMightIcon192.png'
        });

        try {
            await webpush.sendNotification(subscription, payload);
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}