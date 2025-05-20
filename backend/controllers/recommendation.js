const path = require('path');
const { spawn } = require('child_process');

const controller = {
  getRecommendations: async (req, res) => {
    const employeeId = req.params.employeeId;

    const scriptPath = path.join(__dirname, '..', 'ML', 'recommend_specialists.py');
    const pythonProcess = spawn('python', [scriptPath, employeeId]);

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', data => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', data => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', code => {
      if (code !== 0) {
        return res.status(500).json({ error: 'Eroare la rularea scriptului Python', details: errorOutput });
      }

      try {
        const parsed = JSON.parse(output);
        res.json(parsed);
      } catch (err) {
        res.status(500).json({ error: 'Eroare la parsarea răspunsului', rawOutput: output });
      }
    });
  }
}



module.exports = controller;
