/**
 * This library exists purely for multi-threaded RSA key generation using the
 * node-rsa module.
 *
 * @module lib/RSAWorker
 *
 * @requires node-rsa
 * @requires workerpool
 */

import RSA from 'node-rsa';
import workerpool from 'workerpool';

/** The key size to create for each key pair */
const bits = process.env.KEY_SIZE;

/** The encoding scheme to be used for keys */
const encoding = process.env.KEY_ENCODING || 'pkcs1';

/** generates a new public/private key pair for a user */
function keypair() {
  const key = new RSA({ b: bits });

  // export a plaintext object
  const plaintext = {
    private: key.exportKey(`${encoding}-private`),
    public: key.exportKey(`${encoding}-public`),
    keySize: bits,
  };

  return plaintext;
}


/**
 * Signs a voucher object with the user's keypair.  Returns a hex-encoded
 * signature in an object.
 *
 * @param {object} data - a data object with at least 'plaintext' and 'voucher'
 * properties.
 */
function sign(data) {
  // import the key pair from the RSA data
  const key = new RSA();
  key.importKey(data.plaintext.public, encoding);
  key.importKey(data.plaintext.private, encoding);

  const signature = key.sign(data.voucher, 'hex');
  return { signature };
}

/**
 * @param {object} data - a data object with at least 'plaintext', 'voucher',
 * and signature properties.
 * @returns {object} response - a response object containing a boolean value.
 */
function verify(data) {
  const key = new RSA();
  key.importKey(data.plaintext.public, encoding);
  key.importKey(data.plaintext.private, encoding);

  const bool = key.verify(data.voucher, data.signature, 'utf8', 'hex');
  return { bool };
}

/** listen to the parent process for instructions */
workerpool.worker({
  keypair,
  sign,
  verify,
});
