const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Permite que o seu Front-end acesse o Back-end mesmo estando em portas diferentes
app.use(cors());
// Permite que o servidor entenda dados em formato JSON
app.use(express.json());

// Configuração do transportador de e-mail (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Rota POST que o seu Front-end vai chamar
app.post('/api/contato', (req, res) => {
    const { nome, email, mensagem } = req.body;

    // Validação básica
    if (!nome || !email || !mensagem) {
        return res.status(400).json({ erro: 'Por favor, preencha todos os campos.' });
    }

    // Como o e-mail vai chegar na sua caixa de entrada
    const mailOptions = {
        from: process.env.EMAIL_USER, // O remetente precisa ser o seu próprio Gmail autenticado
        replyTo: email, // Se você responder o e-mail, vai para a pessoa que preencheu
        to: 'vitor7moreira7@gmail.com', // Seu e-mail de destino
        subject: `💼 Novo contato do Portfólio: ${nome}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2>Você recebeu uma nova mensagem do seu portfólio!</h2>
                <p><strong>Nome do remetente:</strong> ${nome}</p>
                <p><strong>E-mail de contato:</strong> ${email}</p>
                <p><strong>Mensagem:</strong></p>
                <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; border-left: 4px solid #df0139;">
                    ${mensagem}
                </div>
            </div>
        `
    };

    // Envia o e-mail de fato
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar e-mail:', error);
            return res.status(500).json({ erro: 'Erro ao tentar enviar a mensagem. Tente novamente.' });
        }
        console.log('E-mail enviado:', info.response);
        return res.status(200).json({ sucesso: 'Mensagem enviada com sucesso!' });
    });
});

// Liga o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando lindamente na porta ${PORT}`);
});