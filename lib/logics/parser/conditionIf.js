const valueTransform = require("../../utils/valueTransform");
const kalcerCompare = require("../../utils/kalcerCompare");

const conditionIf = (msg) => {
  // Format untuk "kalo nilai nyampe 80"
  let formatNyampe = /kalo ([a-zA-Z0-9]+) nyampe ([^\[\]\(\)\n]+)/;
  
  // Format untuk "kalo belum nyampe minimal 70"
  let formatBelumNyampe = /kalo belum nyampe minimal ([^\[\]\(\)\n]+)/;
  
  // Format untuk "kalo ga nyampe"
  let formatGaNyampe = /kalo ga nyampe/;
  
  // Format untuk kondisi lainnya
  let formatKondisi = /kalo ([a-zA-Z0-9]+) ((?:belum |udah |masih |ga )?[a-zA-Z ]+) ([^\[\]\(\)\n]+)?/;

  // Cek format nyampe
  let matchNyampe = msg.match(formatNyampe);
  if (matchNyampe) {
    const variable = matchNyampe[1];
    global.lastIfVariable = variable;
    return {
      exp: `if (${variable} >= ${valueTransform(matchNyampe[2])})`,
      openGroup: true,
      isIf: true,
      variable: variable
    };
  }

  // Cek format belum nyampe minimal
  let matchBelumNyampe = msg.match(formatBelumNyampe);
  if (matchBelumNyampe) {
    const variable = global.lastIfVariable;
    if (!variable) {
      console.error("Error: Cannot find parent if statement variable");
      return null;
    }
    return {
      exp: `else if (${variable} < ${valueTransform(matchBelumNyampe[1])})`,
      openGroup: true,
      isElseIf: true,
      variable: variable
    };
  }

  // Cek format ga nyampe
  let matchGaNyampe = msg.match(formatGaNyampe);
  if (matchGaNyampe) {
    return {
      exp: `else`,
      openGroup: true,
      isElse: true
    };
  }

  // Cek format kondisi lainnya
  let matchKondisi = msg.match(formatKondisi);
  if (matchKondisi && matchKondisi[2] && matchKondisi[3]) {
    const variable = matchKondisi[1];
    global.lastIfVariable = variable;
    const operator = kalcerCompare[matchKondisi[2]] || '==';
    return {
      exp: `if (${variable} ${operator} ${valueTransform(matchKondisi[3])})`,
      openGroup: true,
      isIf: true,
      variable: variable
    };
  }

  return null;
};

module.exports = conditionIf;
