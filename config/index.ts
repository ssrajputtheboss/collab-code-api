require('dotenv').config();
import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { join } from 'path';

export const PORT = process.env.PORT;

export const ADMIN_SECRET = process.env.ADMIN_SECRET;

export const SECRET = process.env.SECRET;

export const SIX_HOURS = 6 * 60 * 60 * 1000;

export const DATABASE_URL = process.env.DATABASE_URL;

export const ADMIN_JWT = jwt.sign({ api : 'api' } , ADMIN_SECRET! , { expiresIn: '2d' });

export const FILE_EXTENSIONS = ['.c','.cpp','.java','.py','.txt'];

export const FILES_PATH = __dirname.replace(/config$/i ,'files');

export const SNIPPET_PATH = __dirname.replace(/config$/i ,'snippets');

const BLOCK_PATH = __dirname.replace(/config$/i ,'blockers');

export const JAVA_BLOCKLIST = fs.readFileSync(join(BLOCK_PATH,'java_blocklist.txt')).toString().split('\n').map(e=>e.replace('\r',''));

export const PYTHON_BLOCKLIST = fs.readFileSync(join(BLOCK_PATH,'python_blocklist.txt')).toString().split('\n').map(e=>e.replace('\r',''));

export const CPP_BLOCKLIST = fs.readFileSync(join(BLOCK_PATH,'cpp_blocklist.txt')).toString().split('\n').map(e=>e.replace('\r',''));

export const C_BLOCKLIST = fs.readFileSync(join(BLOCK_PATH,'c_blocklist.txt')).toString().split('\n').map(e=>e.replace('\r',''));

export const PROCESS_TIMEOUT = 8 * 1000;
