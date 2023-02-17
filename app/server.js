import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import db from './models/index';
import express from 'express';
import { getUser } from './domain/auth/index';
import helmet from 'helmet';
import resolvers from './graphql/resolvers';
import { routes } from './routes';
import { typeDefs } from './graphql/schema';

const corsOptions = {
	origin: process.env.FRONT_URL,
	credentials: true
};

let app = express();
app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/', (req, res, next) => {
	if (req.cookies && req.cookies['token']) {
		req.user = getUser(req.cookies['token']);
	}
	next();
});

app = routes(db, app);

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({
		user: req.user,
		db
	})
});

server.start().then(() => {
	server.applyMiddleware({
		app,
		cors: corsOptions
	});

	app.use(express.static('public'));

	db.sequelize.sync().then(() => {
		app.listen({ port: 4000 }, () =>
			console.log(
				`🚀 Server ready at ${process.env.BACK_URL}${server.graphqlPath}`
			)
		);
	});
});
