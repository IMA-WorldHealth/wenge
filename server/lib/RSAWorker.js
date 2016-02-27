/**
 * This library exists purely for multi-threaded RSA key generation using the
 * node-rsa module.
 *
 * @module lib/rsa
 */

const RSA = require('node-rsa');
const workerpool = require('workerpool');

// The key size to create for each key pair
const bits = process.env.KEY_SIZE;

// The encoding scheme to be used for keys
const encoding = process.env.KEY_ENCODING || 'pkcs1';


/** generates a new public/private key pair for a user */
function generateKeyPair() {
  'use strict';

  // create a new RSA public/private keypair with size `bits`
  let key = new RSA({ b : bits });

  // export a plaintext object
  let plaintext = {
    private: key.exportKey(`${encoding}-private`),
    public:  key.exportKey(`${encoding}-public`),
    keySize: bits
  };

  return plaintext;
}


/**
 * Signs a voucher object with the user's keypair.  Returns a hex-encoded
 * signature in an object.
 *
 * @param {object} data - a data object with at least 'plaintext' and 'voucher'
 * properties.
 *
 */
function signVoucher(data) {
  'use strict';

  // import the key pair from the RSA data
  let key = new RSA();
  key.importKey(data.plaintext.public, encoding);
  key.importKey(data.plaintext.private, encoding);

  let signature = key.sign(data.voucher, 'hex');
  return { signature : signature };
}

/**
 * @param {object} data - a data object with at least 'plaintext', 'voucher',
 * and signature properties.
 * @returns {object} response - a response object containing a boolean value.
 */
function verifyVoucher(data) {
  'use strict';

  let key = new RSA();
  key.importKey(data.plaintext.public, encoding);
  key.importKey(data.plaintext.private, encoding);

  let bool = key.verify(data.voucher, data.signature, 'utf8', 'hex');
  return { bool : bool };
}

/** listen to the parent process for instructions */
workerpool.worker({
  keypair : generateKeyPair,
  sign : signVoucher,
  verify : verifyVoucher
});
