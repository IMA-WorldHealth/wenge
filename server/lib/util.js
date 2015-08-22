
function choose(array) {
  var i = array.length;
  var r = Math.random() * i;
  return array[Math.floor(r)];
}

exports.generatePRF = function generatePRF() {
  return {
    id          : Math.floor(Math.random() * 10000),
    project     : choose(['IMA (431)', 'SANRU (313)', 'Global Fund', 'LCP', 'WWF']),
    date        : new Date(Math.random() > 0.5 ? Date.now() + Math.random() * 1000000 : Date.now() - Math.random() * 1000000),
    requestor   : choose(['Jonathan Niles', 'Wayne Niles', 'Katherine Niles', 'Evan Schellenburg', 'Dedrick Kitamuka', 'Chris Lomame', 'Ed Noyes']),
    beneficiary : choose(['Jonathan Niles', 'Wayne Niles', 'Katherine Niles', 'Evan Schellenburg', 'Dedrick Kitamuka', 'Chris Lomame', 'Ed Noyes']),
    amount : Math.round(Math.random() * 1000, 2),
    signatures : {
      dcop : Math.random() > 0.5 ? 'Luke' : '',
      cop : Math.random() > 0.5 ? 'Larry' : ''
    },
    review : ''
  };
};
