const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {

    // Get original extension
    const ext = path.extname(file.originalname);

    // Create unique filename
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

app.post('/compress', upload.single('file'), (req, res) => {

  console.log("LEVEL:", req.body.level);

  const allowedLevels = ['screen', 'ebook', 'printer'];

  const level = allowedLevels.includes(req.body.level)
    ? req.body.level
    : 'screen';

  const inputPath = req.file.path;

  const outputPath = `uploads/compressed-${Date.now()}.pdf`;

  // Compression settings
  const settings = {
    screen: {
      resolution: 72,
      quality: 30,
    },

    ebook: {
      resolution: 150,
      quality: 60,
    },

    printer: {
      resolution: 300,
      quality: 90,
    },
  };

  const selected = settings[level];

  // Ghostscript command
  const command = `"C:\\Program Files\\gs\\gs10.07.0\\bin\\gswin64c.exe" -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${level} -dDownsampleColorImages=true -dColorImageDownsampleType=/Bicubic -dColorImageResolution=${selected.resolution} -dJPEGQ=${selected.quality} -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;

  console.log(command);

  exec(command, (err) => {
    const originalSize = fs.statSync(inputPath).size;
const compressedSize = fs.statSync(outputPath).size;

// If compression increased size
if (compressedSize >= originalSize) {

  return res.download(inputPath, 'compressed.pdf', () => {

    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
  });
}

    if (err) {
      console.error(err);
      return res.status(500).send('Compression failed');
    }

    res.download(outputPath, 'compressed.pdf', () => {

      // Delete temp files
      fs.unlinkSync(inputPath);

      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    });
  });
});
app.post('/word-to-pdf', upload.single('file'), (req, res) => {

  // Uploaded DOCX path
  const inputPath = req.file.path;

  // Output folder
  const outputDir = path.join(__dirname, 'uploads');

  // LibreOffice command
  const command = `& "C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf "${inputPath}" --outdir "${outputDir}"`;

  // Run command
  exec(command, { shell: 'powershell.exe' }, (err) => {

    if (err) {
      console.error(err);
      return res.status(500).send('Conversion failed');
    }

    // Replace .docx with .pdf
    const pdfPath = inputPath.replace(
      path.extname(inputPath),
      '.pdf'
    );

    // Send PDF to user
    res.download(pdfPath, 'converted.pdf', () => {

      // Delete uploaded DOCX
      if (fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }

      // Delete generated PDF
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    });
  });
});
app.post('/ppt-to-pdf', upload.single('file'), (req, res) => {

  const inputPath = req.file.path;

  const outputDir = path.join(__dirname, 'uploads');

  const command = `& "C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf:impress_pdf_Export "${inputPath}" --outdir "${outputDir}"`;
  exec(command, { shell: 'powershell.exe' }, (err) => {

    if (err) {
      console.error(err);
      return res.status(500).send('Conversion failed');
    }

    const pdfPath = inputPath.replace(
      path.extname(inputPath),
      '.pdf'
    );

    res.download(pdfPath, 'converted.pdf', () => {

      if (fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }

      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    });
  });
});
app.post('/excel-to-pdf', upload.single('file'), (req, res) => {

  const inputPath = req.file.path;

  const outputDir = path.join(__dirname, 'uploads');

  const command = `& "C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf:calc_pdf_Export "${inputPath}" --outdir "${outputDir}"`;

  exec(command, { shell: 'powershell.exe' }, (err) => {

    if (err) {
      console.error(err);
      return res.status(500).send('Conversion failed');
    }

    const pdfPath = inputPath.replace(
      path.extname(inputPath),
      '.pdf'
    );

    res.download(pdfPath, 'converted.pdf', () => {

      if (fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }

      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    });
  });
});
app.post('/pdf-to-word', upload.single('file'), (req, res) => {

  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const inputPath = req.file.path + '.pdf';

  fs.renameSync(req.file.path, inputPath);

  const fileSizeMB =
    fs.statSync(inputPath).size / (1024 * 1024);

  const outputPath =
    inputPath.replace('.pdf', '.docx');

  console.log(`PDF SIZE: ${fileSizeMB.toFixed(2)} MB`);

  // SMALL PDFs → pdf2docx
  if (fileSizeMB <= 5) {

    console.log("USING pdf2docx ENGINE");

    const compressedPath =
      inputPath.replace('.pdf', '-compressed.pdf');

    const scriptPath = path.join(
      __dirname,
      'convert_pdf_to_word.py'
    );

    // Compress first
    const compressCommand =
      `"C:\\Program Files\\gs\\gs10.07.0\\bin\\gswin64c.exe" \
-sDEVICE=pdfwrite \
-dCompatibilityLevel=1.4 \
-dPDFSETTINGS=/ebook \
-dNOPAUSE -dQUIET -dBATCH \
-sOutputFile="${compressedPath}" "${inputPath}"`;

    exec(compressCommand, (compressErr) => {

      if (compressErr) {

        console.error(compressErr);

        return res.status(500).send('Compression failed');
      }

      const convertCommand =
        `python "${scriptPath}" "${compressedPath}" "${outputPath}"`;

      exec(convertCommand, (err) => {

        if (err) {

          console.error(err);

          return res.status(500).send('Conversion failed');
        }

        sendFile();
      });
    });
  }

  // LARGE PDFs → LibreOffice
  else {

    console.log("USING LIBREOFFICE ENGINE");

    const outputDir = path.join(
      __dirname,
      'uploads'
    );

    const libreCommand =
      `& "C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to docx "${inputPath}" --outdir "${outputDir}"`;

    exec(
      libreCommand,
      { shell: 'powershell.exe' },
      (err) => {

        if (err) {

          console.error(err);

          return res.status(500).send('Conversion failed');
        }

        sendFile();
      }
    );
  }

  // SEND FILE FUNCTION
  function sendFile() {

    if (!fs.existsSync(outputPath)) {

      return res.status(500).send('DOCX not created');
    }

    res.download(
      outputPath,
      'converted.docx',
      () => {

        const compressedPath =
          inputPath.replace('.pdf', '-compressed.pdf');

        [
          inputPath,
          outputPath,
          compressedPath
        ].forEach((file) => {

          if (fs.existsSync(file)) {
            fs.unlinkSync(file);
          }
        });
      }
    );
  }
});
app.post('/pdf-to-ppt', upload.single('file'), (req, res) => {

  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const inputPath = req.file.path + '.pdf';

  fs.renameSync(req.file.path, inputPath);

  const outputDir = path.join(
    __dirname,
    'uploads'
  );

  const outputPath =
    inputPath.replace('.pdf', '.pptx');

  const command =
    `& "C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pptx "${inputPath}" --outdir "${outputDir}"`;

  console.log("CONVERTING PDF TO PPT...");

  exec(
    command,
    { shell: 'powershell.exe' },
    (err, stdout, stderr) => {

      console.log(stdout);
      console.log(stderr);

      if (err) {

        console.error(err);

        return res.status(500).send('Conversion failed');
      }

      if (!fs.existsSync(outputPath)) {

        return res.status(500).send('PPT not created');
      }

      res.download(
        outputPath,
        'converted.pptx',
        () => {

          [
            inputPath,
            outputPath
          ].forEach((file) => {

            if (fs.existsSync(file)) {
              fs.unlinkSync(file);
            }
          });
        }
      );
    }
  );
});
app.post('/pdf-to-excel', upload.single('file'), (req, res) => {

  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  // Uploaded PDF path
  const inputPath = req.file.path;

  // Output Excel path
  const outputPath =
    inputPath.replace('.pdf', '.xlsx');

  // Python script path
  const scriptPath = path.join(
    __dirname,
    'convert_pdf_to_excel.py'
  );

  // Python command
  const command =
    `python "${scriptPath}" "${inputPath}" "${outputPath}"`;

  console.log("CONVERTING PDF TO EXCEL...");

  exec(command, (err, stdout, stderr) => {

    console.log("STDOUT:", stdout);

    console.log("STDERR:", stderr);

    if (err) {

      console.error(err);

      return res
        .status(500)
        .send('Conversion failed');
    }

    // Check if Excel created
    if (!fs.existsSync(outputPath)) {

      return res
        .status(500)
        .send('Excel file not created');
    }

    // Send Excel
    res.download(
      outputPath,
      'converted.xlsx',
      () => {

        // Delete temp files
        [inputPath, outputPath]
          .forEach((file) => {

            if (fs.existsSync(file)) {
              fs.unlinkSync(file);
            }
          });
      }
    );
  });
});
app.listen(5000, () =>
  console.log('🚀 Server running on port 5000')
);