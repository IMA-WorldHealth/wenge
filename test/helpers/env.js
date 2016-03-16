/**
 * Set up environental variables before server is run
 */

// set environmental variables appropriately
process.env.APP = 'wenge';
process.env.ENV = 'test';
process.env.BUILD_DIR = 'dist';
process.env.SESS_SECRET = 'S4meT3stS3cr3t';
process.env.LOG_LEVEL = 'debug';
process.env.DB = '/home/jniles/wenge/wenge.db';
process.env.MAILGUN_DOMAIN = 'mg.somedomain.com';
process.env.MAILGUN_KEY = 'key-somerandomhash';
