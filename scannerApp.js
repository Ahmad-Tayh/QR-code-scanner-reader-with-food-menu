const express = require('express');
const QrCode = require('qrcode-reader');
const jimp = require("jimp");
const multer = require('multer');
const fs = require('fs');

const app = express();

// Register the view engine for dynamic data
app.set('view engine', 'ejs');

// Function to check if a string is a URL link
function isNotLink(string) {
  const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  return !regex.test(string);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
const upload = multer({ storage });

// Route to display the main page
app.get('/', (req, res) => {
    return res.render('index', { error: '' });
});

// Route to handle file upload and decode QR code
app.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    // If no file was uploaded, display error message
    return res.render('index', { error: 'Please select QR image' });
  }
  
  // Read the uploaded image
  const img = await jimp.read(fs.readFileSync(req.file.path));

  // Decode the QR code
  const qr = new QrCode();
  qr.callback = function (err, value) {
    if (err) {
      // If there is an error decoding the QR code, return the error message
      return res.status(400).send({ error: err.message });
    }

    let error = null;
    if(isNotLink(value.result)){
      // If the decoded result is not a URL link, display error message
      error = 'This is not a link';
      return res.render('index', { error });
    } 

    // If the decoded result is a URL link, redirect to the link
    return res.redirect(value.result);
  };
  qr.decode(img.bitmap);

  // Delete the uploaded image after processing
  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: 'Error deleting photo' });
    }
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
