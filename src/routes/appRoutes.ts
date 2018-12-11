import { Request, Response } from "express";
import {UserAttributes, UserInstance} from "../models/User";
import * as expressValidator from 'express-validator';
import session from "express-session";

/**
 * Класс задает роуты и их обработчики
*/
export class Routes {

	public routes(app, db): void {

		app.get('/', (req: Request, res: Response) => {
			res.render('index', { title: 'Hello ex[ress app'})
		})

		app.get('/cabinet/:id', (req , res: Response) => {
			if (!req.session.user) {
			    /**
                 * TODO redirect if not logged in
                 * */
                res.redirect('http://localhost:3000')
				// return res.status(401).send();
			} else {

                db.User.findOne({
                        where: {id: req.params.id}
                    })
                    .then(
                        (user) => {
                            if (!user) {
                                return  res.render('message', { flash: { type: 'alert-danger', messages: [{msg: 'Неправильный логин/пароль'}] }});
                            }
                            // req.session.user = user
                            return res.render('cabinet', { name: user.name,
                                                                        age: user.age,
                                                                        email: user.email,
                                                                        id: user.id})
                            // return res.status(200).send('done')
                        })
                    .catch(err => res.status(500).json({ err: ['error', err] }))
            }

		})

        app.get('/register', (req: Request , res: Response) => {
            res.render('register')
        })

		app.post('/login', (req , res ) => {
			let username = req.body.email
			let password = req.body.password

            req.checkBody('password', 'password is required').notEmpty();
            req.checkBody('email', 'Email is required').notEmpty();

            let errors = req.validationErrors();

            console.log(errors);

            if (errors) {
                return res.render('message', { flash: { type: 'alert-danger', messages: errors }});
            }
            db.User.findOne({ where: {email: username, password: password} })
                    .then(
                        (user) => {
                            if (!user) {
                                return res.render('message', { flash: { type: 'alert-danger', messages: [{msg: 'Неправильный логин/пароль'}] }});
                            }
                            req.session.user = user

                            return res.status(200).json(user)
                        })
                    .catch(err => res.status(500).json({ err: ['error', err] }))

		})

        app.get('/logout', (req , res: Response) => {
            req.session.destroy();
            /**
             * TODO redirect if not logged in
             * */
            res.redirect('http://localhost:3000')
        })

		app.post('/add', (req, res: Response) => {
			let body = req.body
			console.log(req.body.name)

			req.checkBody('name', 'name is required').notEmpty();
			req.checkBody('age', 'age is required').notEmpty();
            if(req.body.password) req.checkBody('password', 'password is required').notEmpty();
			req.checkBody({ 
				'product_price': {
				  optional: {
					options: { checkFalsy: true }
				  },
				  isDecimal: {
					errorMessage: 'The product price must be a decimal'
				  }
				}
			  });
			req.checkBody('email', 'Email is required').notEmpty();
			req.checkBody('email', 'Email does not appear to be valid').isEmail();

			// check the validation object for errors
			let errors = req.validationErrors();

			console.log(errors);  

			if (errors) {
				res.render('message', { flash: { type: 'alert-danger', messages: errors }});
			}
			else {
				
				db.User.create({
					name: body.name,
					age: body.age,
					email: body.email,
                    password: body.password
				})
				  .then((user: UserInstance[]) => {
                      req.session.user = user;
                      res.render('message', { flash: { type: 'alert-success', messages: [ { msg: 'No errors!' }]}});
                  })
				  .catch(err => res.status(500).json({ err: ['error', err] }));
			}

			
		})

		app.post('/users', (req: Request, res: Response) => {
            let body = req.body;
            console.log(body)
            let query = {
                where: (body.filter[Object.keys(body.filter)[0]] !== ('' || null || undefined)) ? body.filter : {},
                order: [
                    body.order
                ]
            }
            db.User.findAll(query)
			  .then((users: UserInstance[]) => res.status(200).json({ users }))
			  .catch(err => res.status(500).json({ err: ['error', err] }));
		})

        app.put('/update/user/:id', (req: Request, res: Response) => {
            let body = req.body;
            req.checkBody('name', 'name is required').notEmpty();
            req.checkBody('age', 'age is required').notEmpty();
            req.checkBody({
                'product_price': {
                    optional: {
                        options: { checkFalsy: true }
                    },
                    isDecimal: {
                        errorMessage: 'The product price must be a decimal'
                    }
                }
            });
            req.checkBody('email', 'Email is required').notEmpty();
            req.checkBody('email', 'Email does not appear to be valid').isEmail();

            // check the validation object for errors
            let errors = req.validationErrors();

            console.log(errors);

            if (errors) {
                console.log('errors');
                res.render('message', { flash: { type: 'alert-danger', messages: errors }});
            } else {
                console.log('db User update');
                db.User.update({
                    ame: body.name,
                    age: body.age,
                    email: body.email
                },{
                    where: {id: req.params.id}
                    }).then(function() {
                        res.render('message', { flash: { type: 'alert-success', messages: [ { msg: 'Успешно сохранено!' }]}});
                     }).catch(err => res.status(500).json({ err: ['error', err] }));
            }

        })

		app.route('*').get((req: Request, res: Response) => {
				res.status(400).send({
					message: 'No route defined.'
				})
		})
	}
}