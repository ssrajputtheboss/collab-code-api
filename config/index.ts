require('dotenv').config()
import jwt from 'jsonwebtoken';

export const PORT = process.env.PORT;

export const ADMIN_SECRET = process.env.ADMIN_SECRET;

export const SECRET = process.env.SECRET;

export const SIX_HOURS = 6 * 60 * 60 * 1000;

export const DATABASE_URL = process.env.DATABASE_URL;

export const ADMIN_JWT = jwt.sign({ api : 'api' } , ADMIN_SECRET!);

export const FILE_EXTENSIONS = ['.c','.cpp','.java','.py','.txt'];

export const FILES_PATH = __dirname.replace(/config$/i ,'files');

export const SNIPPET_PATH = __dirname.replace(/config$/i ,'snippets');

export const PROCESS_TIMEOUT = 5 * 1000;
