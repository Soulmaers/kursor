const app = require('./app')
git pullconst port = process.env.PORT || 3333
app.listen(port, () => console.log(`Сервер запущен, порт:${port}`))
