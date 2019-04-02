/*eslint no-console: 0*/
/*eslint no-undef: 0*/
import 'axe-core/axe.min.js';

/*
* Rules can be disabled using the options parameter:
* options = { "rules":
*   {
*     "color-contrast": { enabled: false },
*     "valid-lang": { enabled: false }
*   }
* }
* Rule ids can be found here: https://github.com/dequelabs/axe-core/blob/master/doc/rule-descriptions.md
*/
export function runAxe(element, callback, options) {
	axe.run(element, options || {}).then((results) => {
		const violations = results.violations;

		console.log('Inapplicable Tests:', results.inapplicable.length);
		console.log('Passed Tests:', results.passes.length);
		console.log('Failed Tests:', results.violations.length);

		if (!violations.length) {
			callback();
		} else {
			const errorMessage = ['Accessibility Violations', '---'];
			for (const violation of violations) {
				errorMessage.push(violation.help);
				for (const node of violation.nodes) {
					if (node.failureSummary) {
						errorMessage.push(node.failureSummary);
					}
					errorMessage.push(node.html);
				}
				errorMessage.push('---');
			}
			callback(new Error(errorMessage.join('\n')));
		}
	});
}
