const express = require('express');
const router = express.Router();

const PDFDocument = require('pdfkit');

const Curso = require('../models/curso');
const Alumno = require('../models/alumno');
const Profesor = require('../models/profesores');
const Clases = require('../models/clases');


/**
 * @swagger
 * /api/{filename}:
 *   get:
 *     summary: Get a PDF report of Instituto data
 *     tags:
 *       - PDF
 *     produces:
 *       - application/pdf
 *     parameters:
 *       - name: filename
 *         in: path
 *         required: true
 *         description: Name of the downloaded PDF file
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF report downloaded successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error generating PDF report
 */


// GET 
router.get('/api/:filename', async (req, res) => {
  const { filename } = req.params;
  try {
    const alumnos = await Alumno.find();
    const cursos = await Curso.find();
    const profesores = await Profesor.find();
    const clases = await Clases.find();

      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream('output.pdf'));

      doc.font('Helvetica-Bold')
        .fontSize(20)
        .text('Instituto', { align: 'center' })
        .moveDown();

      doc.font('Helvetica')
        .fontSize(12)
        .text('Alumnos', { underline: true })
        .moveDown();

      alumnos.forEach(alumno => {
        doc.text(`ID: ${alumno.id} - ${alumno.nombre} ${alumno.Apellidos}, ${alumno.Edad} años`);
      });

      doc.moveDown()
        .font('Helvetica')
        .fontSize(12)
        .text('Cursos', { underline: true })
        .moveDown();

      cursos.forEach(curso => {
        doc.text(`ID: ${curso.id} - ${curso.nombre} (${curso.no_clases && curso.no_clases.length > 0 ? curso.no_clases.length + " clases" : "Sin clases asignadas"})`);
        if (curso.no_clases && curso.no_clases.length > 0) {
          curso.no_clases.forEach(claseId => {
            const nombreClase = clases.find(clase => clase._id.toString() === claseId.toString())?.nombre;
            if (nombreClase) {
              doc.text(`- ${nombreClase}`);
            }
          });
        }
      });

      doc.moveDown()
        .font('Helvetica')
        .fontSize(12)
        .text('Profesores', { underline: true })
        .moveDown();

      profesores.forEach(profesor => {
        doc.text(`ID: ${profesor.id} - ${profesor.Nombre} ${profesor.Apellidos}`);
      });

      doc.moveDown()
        .font('Helvetica')
        .fontSize(12)
        .text('Clases', { underline: true })
        .moveDown();

      clases.forEach(clase => {
        const alumnosAsignados = clase.no_clases && clase.no_clases.length > 0 ? clase.no_clases.map(id => {
          const alumno = alumnos.find(alumno => alumno._id.toString() === id.toString());
          const nombreAlumno = alumno ? `${alumno.nombre} ${alumno.Apellidos}` : 'Alumno no encontrado';
          return nombreAlumno;
        }).join(', ') : "Sin alumnos asignados";
        const profesorAsignado = clase.no_asig && profesores.find(p => p._id.toString() === clase.no_asig.toString()) ? `${profesores.find(p => p._id.toString() === clase.no_asig.toString()).Nombre} ${profesores.find(p => p._id.toString() === clase.no_asig.toString()).Apellidos}` : "Profesor no asignado";
        doc.text(`ID: ${clase.id} - ${clase.nombre} (${alumnosAsignados} - Profesor: ${profesorAsignado})`);
      });

doc.end();
    
    res.download('output.pdf', filename);
 
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;

/*
// GET 
router.get('/api', async (req, res) => {
  try {
    const alumnos = await Alumno.find();
    const cursos = await Curso.find();
    const profesores = await Profesor.find();
    const clases = await Clases.find();
    res.send(`
      <html>
        <head>
          <title>Instituto</title>
        </head>
        <body>
          <h1>Instituto</h1>
          <table>
            <tr>
              <th>Alumnos</th>
            </tr>
            ${alumnos && alumnos.length > 0 ? alumnos.map(alumno => `
            <tr>
               <td> -- ID: ${alumno.id} ---- ${alumno.nombre} ${alumno.Apellidos}, ${alumno.Edad} años</td>
            </tr>
         `).join('') : 'No hay alumnos registrados'}
            <tr>
              <th>Cursos</th>
            </tr>
              ${cursos.map(curso => `
                <tr>
                  <td> -- ID: ${curso.id} ----${curso.nombre} (${curso.no_clases && curso.no_clases.length > 0 ? curso.no_clases.length + " clases" : "Sin clases asignadas"})</td>
                </tr>
                ${curso.no_clases && curso.no_clases.length > 0 ? curso.no_clases.map(claseId => `
                  <tr>
                    <td>${clases.find(clase => clase._id.toString() === claseId.toString())?.nombre}</td>
                  </tr>
                `).join('') : ""}
              `).join('')}
            <tr>
              <th>Profesores</th>
            </tr>
              ${profesores.map(profesor => `
                <tr>
                  <td> -- ID: ${profesor.id} ----${profesor.Nombre} ${profesor.Apellidos}</td>
                </tr>
              `).join('')}
            <tr>
              <th>Clases</th>
            </tr>
              ${clases.map(clase => `
                <tr>
                  <td>
                      -- ID: ${clase.id}  ----
                      ${clase.nombre} (${clase.no_clases && clase.no_clases.length > 0 ? clase.no_clases.map(id => {
                        const alumno = alumnos.find(alumno => alumno._id.toString() === id.toString());
                        const nombreAlumno = alumno ? alumno.nombre : 'Alumno no encontrado';
                        const apellidoAlumno = alumno ? alumno.Apellidos : 'Alumno no encontrado';
                        return ` ${nombreAlumno} ${apellidoAlumno} `;
                    }).join(', ') : "Sin alumnos asignados"} -------- Profesor: ${clase.no_asig && profesores.find(p => p._id.toString() === clase.no_asig.toString()) ? profesores.find(p => p._id.toString() === clase.no_asig.toString()).Nombre + " " + profesores.find(p => p._id.toString() === clase.no_asig.toString()).Apellidos : "Profesor no asignado"})
                  </td>
                </tr>
              `).join('')}
          </table>
        </body>
      </html>`);
    
 
  } 
  */