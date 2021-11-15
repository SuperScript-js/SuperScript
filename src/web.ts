
export function render(component: Function, rootElement: HTMLElement) {
	const componentElement = component();
	rootElement.replaceChildren(componentElement);
}