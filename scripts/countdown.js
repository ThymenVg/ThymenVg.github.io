	// Wait until DOM is loaded so elements like #slot-machine exist
	document.addEventListener('DOMContentLoaded', () => {
	// `today` is the current local date/time
	const today = new Date();
	// `target` is the date we are counting toward (Jan 30, 2027 at midnight)
	const target = new Date('2027-01-30T00:00:00');
	// milliseconds in one day (used to convert ms to days)
	const msPerDay = 24 * 60 * 60 * 1000;
	// difference in UTC days between target and today (ms)
	const diffMs = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
	// daysNumber is whole days remaining (non-negative)
	const daysNumber = Math.max(0, Math.ceil(diffMs / msPerDay));

	// `daysDisplay` was used by the old slot-machine code (last 3 digits); kept here only for accessibility fallback
	const daysDisplay = String(daysNumber % 1000).padStart(3, '0');
	// `machine` is the container (<div id="slot-machine">) where digit cells will be rendered
	const machine = document.getElementById('slot-machine');
	// set an accessible name so screen readers announce the full number
	if (machine) machine.setAttribute('aria-label', `Days until Jan 31, 2027: ${daysNumber}`);

	// Render a series of `.reel > .digit` elements inside `#slot-machine`.
	// `valueStr` is the string representation of the final number (e.g. "1234").
	// We clear the container and create one `.reel` for each character so there are
	// exactly as many digit cells as needed (no leading zeros).
	function renderDigitsFor(valueStr) {
		if (!machine) return []; // guard if container is missing
		machine.innerHTML = ''; // remove any existing children
		const arr = [];
		for (let i = 0; i < valueStr.length; i++) {
			const reel = document.createElement('div'); // outer box for visual styling
			reel.className = 'reel';
			const digit = document.createElement('div'); // actual digit element
			digit.className = 'digit';
			digit.textContent = '0'; // start visual at 0 while counting
			reel.appendChild(digit);
			machine.appendChild(reel);
			arr.push({ el: digit }); // store reference to digit element for updates
		}
		return arr; // return an array of objects with .el pointing to each `.digit`
	}

	// initial render: create digit cells matching the number of digits in the final value
	const finalStr = String(daysNumber);
	let reels = renderDigitsFor(finalStr);

	// Create a small confetti burst anchored to a specific container (per-reel)
	// This function is not used for the final combined burst, but kept for completeness.
	function createConfettiBurst(container) {
		if (!container) return;
		// color palette for confetti pieces
		const colors = ['#2b9cff', '#ff6b6b', '#ffd43b', '#4cd97b', '#9b7cff'];
		const pieces = 6; // how many pieces to create (subtle burst)
		for (let i = 0; i < pieces; i++) {
			const piece = document.createElement('div');
			piece.className = 'confetti-piece';
			// random size between 6 and 15 px
			const size = Math.floor(6 + Math.random() * 10);
			piece.style.width = size + 'px';
			piece.style.height = size + 'px';
			// make some pieces circular
			if (Math.random() < 0.3) piece.style.borderRadius = '50%';
			piece.style.background = colors[Math.floor(Math.random() * colors.length)];

			// place near the top-left or top-right of the container
			const corner = i < pieces / 2 ? 'left' : 'right';
			piece.style.top = (6 + Math.random() * 8) + '%';
			piece.style.left = corner === 'left' ? (6 + Math.random() * 8) + '%' : (68 + Math.random() * 24) + '%';

			// movement and rotation parameters (stored in CSS variables used by @keyframes)
			const dx = (corner === 'left' ? -1 : 1) * (40 + Math.random() * 80); // horizontal px
			const dy = 40 + Math.random() * 80; // vertical px (downwards)
			const rot = (Math.random() * 720 - 360) + 'deg'; // final rotation offset
			const startRot = Math.floor(Math.random() * 360) + 'deg'; // initial rotation
			const duration = 600 + Math.floor(Math.random() * 400); // ms duration for this piece

			// write variables that the CSS animation reads
			piece.style.setProperty('--dx', dx + 'px');
			piece.style.setProperty('--dy', dy + 'px');
			piece.style.setProperty('--rot', rot);
			piece.style.setProperty('--start-rot', startRot);
			piece.style.animation = `confetti-pop ${duration}ms cubic-bezier(.2,.8,.2,1) forwards`;

			container.appendChild(piece);
			// remove DOM node after its animation finishes to avoid accumulation
			piece.addEventListener('animationend', () => piece.remove());
		}
	}

	// Create a confetti burst spanning the whole slot-machine (both top corners)
	// Create a combined confetti burst from all four corners of the `machine` container.
	// We place a few pieces in each corner (top-left, top-right, bottom-left, bottom-right)
	// and animate them outward. Top corners use negative vertical movement so they pop upward.
	function createConfettiFullBurst(container) {
		if (!container) return;
		const colors = ['#0063b9', '#cc0000', '#ffffff'];
		// corner definitions: percentage ranges for top/left positions and a horizontal direction (dir)
		const corners = [
			{ topRange: [2, 10], leftRange: [2, 10], dir: -1 }, // top-left
			{ topRange: [2, 10], leftRange: [78, 96], dir: 1 }, // top-right
			{ topRange: [78, 92], leftRange: [2, 10], dir: -1 }, // bottom-left
			{ topRange: [78, 92], leftRange: [78, 96], dir: 1 }, // bottom-right
		];

		corners.forEach(corner => {
			const pieces = 30; // number of pieces per corner (keeps burst subtle)
			for (let i = 0; i < pieces; i++) {
				const piece = document.createElement('div');
				piece.className = 'confetti-piece';
				const size = Math.floor(6 + Math.random() * 10);
				piece.style.width = size + 'px';
				piece.style.height = size + 'px';
				if (Math.random() < 0.35) piece.style.borderRadius = '50%';
				piece.style.background = colors[Math.floor(Math.random() * colors.length)];

				// pick a random position within the corner's percentage ranges
				const topPct = corner.topRange[0] + Math.random() * (corner.topRange[1] - corner.topRange[0]);
				const leftPct = corner.leftRange[0] + Math.random() * (corner.leftRange[1] - corner.leftRange[0]);
				piece.style.top = topPct + '%';
				piece.style.left = leftPct + '%';

				// dx: horizontal travel (dir controls left/right)
				const dx = corner.dir * (30 + Math.random() * 100);
				// For top corners, we want pieces to pop upward, so dy is negative; bottom corners fall downward
				const dy = corner.topRange[0] < 50 ? -(30 + Math.random() * 90) : (30 + Math.random() * 90);
				const rot = (Math.random() * 720 - 360) + 'deg';
				const startRot = Math.floor(Math.random() * 360) + 'deg';
				const duration = 600 + Math.floor(Math.random() * 400);

				piece.style.setProperty('--dx', dx + 'px');
				piece.style.setProperty('--dy', dy + 'px');
				piece.style.setProperty('--rot', rot);
				piece.style.setProperty('--start-rot', startRot);
				piece.style.animation = `confetti-pop ${duration}ms cubic-bezier(.2,.8,.2,1) forwards`;

				container.appendChild(piece);
				piece.addEventListener('animationend', () => piece.remove());
			}
		});
	}

	// Replace the old slot-machine random spin and instead count smoothly from 0 up to daysNumber.
	// This creates a numeric count-up animation (e.g. 0,1,2...N) that looks clean and is performant.
	(function runCountUp() {
		const displayFinal = finalStr; // final string (e.g. "123")
		if (daysNumber <= 0) {
			// If no days left, render final value and exit
			reels = renderDigitsFor(displayFinal);
			reels.forEach((r, i) => { if (r.el) r.el.textContent = displayFinal.charAt(i); });
			return;
		}

		// Determine how long the count-up should take. We use a heuristic that scales
		// with the number but caps at `maxDuration` so very large numbers don't take too long.
		const minDuration = 700; // ms minimum
		const maxDuration = 3500; // ms maximum
		const duration = Math.min(maxDuration, minDuration + Math.floor(daysNumber * 10));

		// easing function for smooth deceleration near the end
		function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

		const start = performance.now();
		function tick(now) {
			const t = Math.min(1, (now - start) / duration); // normalized time 0..1
			const value = Math.floor(easeOutCubic(t) * daysNumber); // eased value
			const disp = String(value);
			// if the number of digits has changed (e.g. 9 -> 10), re-render the digit cells
			if (disp.length !== reels.length) {
				reels = renderDigitsFor(disp);
			}
			// update each digit element with the corresponding character
			reels.forEach((r, i) => { if (r.el) r.el.textContent = disp.charAt(i); });
			if (t < 1) {
				// continue animation
				requestAnimationFrame(tick);
			} else {
				// final snap to the exact final value to avoid rounding artifacts
				reels = renderDigitsFor(displayFinal);
				reels.forEach((r, i) => { if (r.el) r.el.textContent = displayFinal.charAt(i); });
				// wait 500ms, then trigger the combined confetti burst
				setTimeout(() => {
					try {
						createConfettiFullBurst(machine);
						document.body.classList.remove('countdown-loading');
						// After showing confetti, show a big 'DAYS' label and stack vertically.
						const slotWrap = machine && machine.parentElement ? machine.parentElement : null; // typically <main>
						if (slotWrap) {
							// add stacked layout so digits and label sit one above the other
							slotWrap.classList.add('stacked');
							// create or reuse the days label
							let daysLabel = slotWrap.querySelector('.days-label');
							if (!daysLabel) {
								daysLabel = document.createElement('div');
								daysLabel.className = 'days-label';
								daysLabel.textContent = 'DAYS';
								slotWrap.appendChild(daysLabel);
							}
							// create or reuse the small subtitle outside (sibling)
							let daysSub = slotWrap.querySelector('.days-sub');
							if (!daysSub) {
								daysSub = document.createElement('div');
								daysSub.className = 'days-sub';
								daysSub.textContent = 'Until Thymen leaves for the States :)';
								slotWrap.appendChild(daysSub);
							} else if (daysSub.parentElement !== slotWrap) {
								// if it previously lived inside the label, move it out
								slotWrap.appendChild(daysSub);
							}
							// reveal with animation a short moment after confetti
							setTimeout(() => {
								daysLabel.classList.add('visible');
								if (daysSub) daysSub.classList.add('visible');
							}, 120);
						}
					} catch (e) { /* ignore errors */ }
				}, 500);
			}
		}
		requestAnimationFrame(tick);
	})();
});