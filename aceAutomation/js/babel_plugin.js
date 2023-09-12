let MAX_SOURCE_ITERATIONS = 5000;
const preventInfiniteLoops = ({ types: t, template }) => {
  const buildGuard = template(`
    if (ITERATOR++ > MAX_ITERATIONS) {
      throw new RangeError(
        'Potential infinite loop: exceeded ' +
        MAX_ITERATIONS +
        ' iterations. You can change max iteration limit in Editor Configure.'
      );
    }
  `);

  return {
    visitor: {
      "WhileStatement|ForStatement|DoWhileStatement": (path, file) => {
        // An iterator that is incremented with each iteration
        const iterator = path.scope.parent.generateUidIdentifier("loopIt");
        const iteratorInit = t.numericLiteral(0);
        path.scope.parent.push({
          id: iterator,
          init: iteratorInit,
        });
        // If statement and throw error if it matches our criteria
        const guard = buildGuard({
          ITERATOR: iterator,
          MAX_ITERATIONS: t.numericLiteral(MAX_SOURCE_ITERATIONS),
        });
        // No block statment e.g. `while (1) 1;`
        if (!path.get("body").isBlockStatement()) {
          const statement = path.get("body").node;
          path.get("body").replaceWith(t.blockStatement([guard, statement]));
        } else {
          path.get("body").unshiftContainer("body", guard);
        }
      },
    },
  };
};
