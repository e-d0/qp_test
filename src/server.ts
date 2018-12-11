import app from './app';

const PORT = 3000;
/**
 * Запуск приложения
*/
app.listen(PORT, () => {
	console.log('Express server listening on port ' + PORT);
})