const app = require('./app')
<<<<<<< HEAD
const port = process.env.PORT || 3333
=======
require('dotenv').config();
const port = process.env.PORT
>>>>>>> 86a9285ca1140ba6d2dcc8b1df4e89489075dce1
app.listen(port, () => console.log(`Сервер запущен, порт:${port}`))





