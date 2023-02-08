const app = require('./app')
const port = process.env.PORT || 3336
app.listen(port, () => console.log(`Сервер запущен, порт:${port}`))
