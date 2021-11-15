function Greetings({ name, initialExclamations = 1 }) {
	const count = state(initialExclamations);
	const repeat = (c, n) => new Array(n).fill(c).join('');

	return <div>
		Hello, <span onClick={() => count++}>
			{name}{repeat('!', count)}
		</span>
	</div>;
}