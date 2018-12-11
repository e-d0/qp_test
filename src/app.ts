import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/appRoutes";
import * as path from "path";
import { createModels } from "./models/";
import { DbInterface } from "./typings/DbInterface";
import * as expressValidator from "express-validator";
import * as session from "express-session";

/**
 * Класс собирает все необходимые фнкции для старта приложения.
*/
class App {

	public app: express.Application;
	public appRoute: Routes = new Routes();
	public sequelize: any;
	db: DbInterface;

	constructor() {
		this.app = express();
		this.config();
		// инициализируем базу данных
		this.db = createModels();
		this.db.sequelize.sync();
		// подключаем парсер для входящих запросов
		this.appRoute.routes(this.app, this.db);
	}

	/**
	 * Функция задает доп параметры для приложения
	 */
	private config(): void {
		// подключаем парсер для входящих запросов
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
		// validator
		this.app.use(expressValidator());
		// session manager
		/**
		 * TODO  в учебных целях
		 * */
		this.app.use(session({secret: 'sepersecret', resave: false, saveUninitialized: true}));
		// папка, где хранятся доступные файлы
		this.app.use(express.static('public'));
		// указываем папку для шаблонов и подключаем шаблонизатор
		this.app.set('views', path.join(__dirname, 'views'));
		this.app.set('view engine', 'pug');
		
	}

}

export default new App().app;