const app = require('./backend/app')
const port = process.env.PORT || 3330
app.listen(port, () => console.log(`Сервер запущен, порт:${port}`))
