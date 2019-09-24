// ====================================================
// Puerto
// ====================================================
process.env.PORT = process.env.PORT || 5000;

// ====================================================
// Entorrno
// ====================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================================================
// Vencimiento del token
// ====================================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '48h';

// ====================================================
// SEED de autenticacion
// ====================================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarollo';

// ====================================================
// Base de Datos
// ====================================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/KudoFinal';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

