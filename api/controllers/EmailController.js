const EmailController = require('express').Router()
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')

EmailController.post('/sendMail', (req, res) => {
  const { ownerEmail, ownerName, customerName, customerEmail, messageBody } =
    req.body

  const companyName = 'WheelWise'

  let config = {
    service: process.env.SERVICE,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  }

  let transporter = nodemailer.createTransport(config)

  let MailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: companyName,
      link: 'https://google.com/',
    },
  })

  let response = {
    body: {
      name: ownerName,
      intro: `${customerName} is interested in your bike, please contact him/her. Here's a message from him/her:- <br /><br /> ${customerName}: ${messageBody}`,
      action: {
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Contact this user',
          link: `https://mail.google.com/mail/?view=cm&fs=1&to=${customerEmail}`,
        },
      },
    },
  }

  let emailBody = MailGenerator.generate(response)

  let message = {
    from: process.env.EMAIL,
    to: ownerEmail,
    subject: 'We got a Customer!',
    html: emailBody,
  }

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(200).json({
        message: 'you should receive an email',
      })
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).json({ err })
    })
})

module.exports = EmailController
