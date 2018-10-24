const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')
const app = express();
const multer = require('multer');
const PORT = process.env.PORT || 5000;
const cors = require('cors')


app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())
const upload = multer();


app.get('/', (req, res)=>{
    res.render('contact')
})
app.post('/dd', upload.array('attachment', 2), (req, res)=>{

   
  console.log(req.body.email)

})  

app.post('/send', upload.array('attachment', 2), (req, res)=>{

    const img1 = req.files[0].buffer
    const img2 = req.files[1].buffer
 
    const file1 = req.files[0].originalname
    const file2 = req.files[1].originalname

    const output = `
    <p><h2>Message</h2> ${req.body.message}</p>
    `;

    // Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'saqibkhan0099@gmail.com', // generated ethereal user
            pass: 'PKsk@922' // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: `"${req.body.name}" ${req.body.email}`, // sender address
        to: 'saqibkhan0099@gmail.com', // list of receivers
        subject: req.body.subject, // Subject line

        html: output, // html body,
        attachments: [
            {   // file on disk as an attachment
                filename: file1,
                content: img1, // stream this file
            },
            {   // file on disk as an attachment
                filename: file2,
                content: img2, // stream this file
            }
        ]

        
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));


       res.redirect('/')
    });
});
    
})

app.listen(PORT)