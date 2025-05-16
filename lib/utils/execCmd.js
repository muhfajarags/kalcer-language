const vm = require('vm');

const cmdToJs = (cmds) => {
  let resultCmds = [];
  let braceStack = [];
  let indentLevel = 0;
  const indent = "  ";

  const addLine = (line) => {
    resultCmds.push(indent.repeat(Math.max(0, indentLevel)) + line);
  };

  console.log("Processing commands:", cmds);

  for (const cmd of cmds) {
    let tempRes = cmd.exp;
    console.log("Processing command:", cmd);
    
    // Handle closing braces for nested conditions
    if (cmd.closeGroup) {
      if (braceStack.length > 0) {
        indentLevel = Math.max(0, indentLevel - 1);
        addLine("}");
        braceStack.pop();
      }
      continue;
    }
    
    // Handle else if and else statements
    if (tempRes.startsWith('else if')) {
      if (braceStack.length > 0 && braceStack[braceStack.length - 1].type === 'if') {
        indentLevel = Math.max(0, indentLevel - 1);
        addLine("} else if (" + cmd.variable + " < " + tempRes.split(" ").pop().slice(0, -1) + ") {");
        indentLevel++;
      } else {
        addLine("else if (" + cmd.variable + " < " + tempRes.split(" ").pop().slice(0, -1) + ") {");
        indentLevel++;
      }
      braceStack.push({ type: 'else-if', variable: cmd.variable });
    } else if (tempRes === 'else') {
      if (braceStack.length > 0 && (braceStack[braceStack.length - 1].type === 'if' || braceStack[braceStack.length - 1].type === 'else-if')) {
        indentLevel = Math.max(0, indentLevel - 1);
        addLine("} else {");
        indentLevel++;
      } else {
        addLine("else {");
        indentLevel++;
      }
      braceStack.push({ type: 'else' });
    } else {
      // Regular statements
      if (cmd.openGroup) {
        if (tempRes.includes('if')) {
          braceStack.push({ type: 'if', variable: cmd.variable });
          addLine(tempRes + " {");
          indentLevel++;
        }
      } else {
        addLine(tempRes);
      }
    }
  }

  // Close any remaining open braces in reverse order
  while (braceStack.length > 0) {
    indentLevel = Math.max(0, indentLevel - 1);
    addLine("}");
    braceStack.pop();
  }

  const finalCode = resultCmds.join("\n");
  console.log("Final generated code:", finalCode);
  return finalCode;
};

const execCmd = (cmds) => {
  let resultCmds = cmdToJs(cmds);
  try {
    console.log("Executing code:", resultCmds);
    const context = {
      console: console,
      setTimeout: setTimeout,
      setInterval: setInterval,
      clearTimeout: clearTimeout,
      clearInterval: clearInterval
    };
    vm.createContext(context);
    vm.runInContext(resultCmds, context);
  } catch (error) {
    console.error("Error executing code:", error.message);
    console.error("Generated code:", resultCmds);
    console.error("Stack trace:", error.stack);
  }
}

module.exports = {
  execCmd,
  cmdToJs
};
