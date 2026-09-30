//#region src/engine/rules.ts
var e = {
	morning: [7, 12],
	afternoon: [12, 17],
	evening: [17, 22]
}, t = [
	"morning",
	"afternoon",
	"evening"
], n = {
	persistHours: 2,
	rainProb: 40,
	rainSureProb: 60,
	rainSureMm: .5,
	rainMmMinProb: 20,
	bootsProb: 50,
	bootsMm: 1,
	breezyWind: 20,
	windyGusts: 40,
	uvProtect: 3,
	uvSunscreenOffSeason: 6,
	glareSunMinutes: 40,
	sunglassesUv: 4,
	snowDepth: .02,
	sunnyCloud: 70,
	shortsFrom: 22,
	thermalsAt: 0,
	snowPantsAt: 2,
	beanieAt: 5,
	beanieWindyAt: 8,
	sunHatFrom: 15,
	uvSunHatOffSeason: 5,
	scarfAt: 5,
	scarfWindyAt: 8,
	glovesAt: 2,
	glovesWindyAt: 5,
	waterFrom: 25,
	spareSocksMm: 5,
	spareSocksMmGrownUps: 10,
	lipBalmAt: 0,
	handWarmersAt: -5,
	fanFrom: 33,
	repellentFrom: 22,
	repellentHumidity: 70,
	repellentMaxWind: 10,
	reflectorDarkMinutes: 30,
	reflectorUntilHour: 18,
	maskParticles: 80,
	maskParticlesSensitive: 60,
	warmRainSandalsFrom: 22,
	shortSocksFrom: 18,
	woolSocksAt: 5,
	woolInRainBootsBelow: 12,
	thermalSocksAt: -5,
	coldThemeBelow: 5,
	cloudyTheme: 65
}, r = {
	alder_pollen: 50,
	birch_pollen: 50,
	olive_pollen: 50,
	grass_pollen: 20,
	mugwort_pollen: 20,
	ragweed_pollen: 20
}, i = {
	cold: -3,
	normal: 0,
	hot: 3
}, a = {
	brown: {
		sunMinutes: n.glareSunMinutes,
		uv: n.sunglassesUv
	},
	hazel: {
		sunMinutes: 35,
		uv: n.sunglassesUv
	},
	green: {
		sunMinutes: 30,
		uv: 3
	},
	blue: {
		sunMinutes: 20,
		uv: 3
	}
}, o = [
	"tshirt",
	"longsleeve",
	"sweater",
	"jacket",
	"rainjacket",
	"coat"
];
function s(e) {
	return e < -5 ? "freezing" : e < 5 ? "cold" : e < 12 ? "chilly" : e < 18 ? "cool" : e < 24 ? "mild" : e < 30 ? "warm" : "hot";
}
function c(e) {
	return e >= 95 ? 6 : e >= 71 && e <= 77 || e === 85 || e === 86 ? 5 : e >= 51 && e <= 67 || e >= 80 && e <= 82 ? 4 : e === 45 || e === 48 ? 3 : e === 3 ? 2 : +(e === 1 || e === 2);
}
function l(e, t) {
	switch (c(e)) {
		case 6: return "storm";
		case 5: return "snow";
		case 4: return "rain";
		case 3: return "fog";
		case 2: return "cloud";
		case 1: return t ? "moonCloud" : "partly";
		default: return t ? "moon" : "sun";
	}
}
var u = [
	56,
	57,
	66,
	67
];
function d(t, n, r) {
	let [i, a] = e[n];
	return t.hours.filter((e) => e.hour >= Math.max(i, r) && e.hour < a);
}
function f(t, r, a, o = 0) {
	let f = d(t, r, o);
	if (f.length === 0) return null;
	let p = (e) => Math.max(...f.map(e)), m = (e) => Math.min(...f.map(e)), h = (e) => f.reduce((t, n) => t + e(n), 0), g = (e, t) => {
		let n = f.map(e).filter((e) => typeof e == "number");
		return n.length > 0 ? t(n) : null;
	}, _ = m((e) => e.feels), v = _ + i[a], y = p((e) => e.precipProb), b = h((e) => e.precip), x = p((e) => e.wind), S = p((e) => e.gusts), C = h((e) => e.snowfall) > 0 || p((e) => e.snowDepth) >= n.snowDepth, w = f.reduce((e, t) => c(t.code) > c(e.code) ? t : e, f[0]), T = S >= n.windyGusts, E = (e) => {
		let t = /(\d{1,2}):(\d{2})/.exec(e);
		return t ? Number(t[1]) * 60 + Number(t[2]) : null;
	}, D = E(t.sunrise), O = E(t.sunset), ee = (D === null || O === null ? 0 : f.reduce((e, t) => {
		let r = Math.max(t.hour * 60, 420), i = Math.min((t.hour + 1) * 60, n.reflectorUntilHour * 60);
		if (i <= r) return e;
		let a = Math.max(0, Math.min(i, D) - r), o = Math.max(0, i - Math.max(r, O));
		return e + a + o;
	}, 0)) >= n.reflectorDarkMinutes, k = f.filter((e) => e.precipProb >= n.rainProb).length, A = t.hours.filter((t) => t.hour >= e.morning[0] && t.hour < e.evening[1]);
	return {
		part: r,
		hours: f.map((e) => e.hour),
		tempMin: m((e) => e.temp),
		tempMax: p((e) => e.temp),
		tempAvg: h((e) => e.temp) / f.length,
		feelsMin: _,
		effective: v,
		precipProbMax: y,
		precipSum: b,
		snow: C,
		windMax: x,
		gustMax: S,
		uvMax: p((e) => e.uv),
		cloudAvg: h((e) => e.cloud) / f.length,
		rainy: k >= n.persistHours || f.some((e) => e.precipProb >= n.rainSureProb && e.precip >= n.rainSureMm),
		breezy: x >= n.breezyWind || T,
		windy: T,
		storm: f.some((e) => e.code >= 95),
		icy: f.some((e) => u.includes(e.code)) || f.some((e) => e.precip > 0) && m((e) => e.temp) <= 0,
		dark: ee,
		fog: f.filter((e) => e.code === 45 || e.code === 48).length >= n.persistHours,
		uvByHour: f.map((e) => e.uv),
		tempByHour: f.map((e) => e.temp),
		dayUvByHour: A.map((e) => e.uv),
		dayTempByHour: A.map((e) => e.temp),
		sunByHour: t.hours.every((e) => typeof e.sunshine == "number") ? f.map((e) => e.sunshine) : null,
		daySunByHour: t.hours.every((e) => typeof e.sunshine == "number") ? A.map((e) => e.sunshine) : null,
		humidityAvg: g((e) => e.humidity, (e) => e.reduce((e, t) => e + t, 0) / e.length),
		particlesMax: g((e) => e.particles, (e) => Math.max(...e)),
		pollen: g((e) => e.pollen, (e) => Math.max(...e)),
		icon: l(w.code, r === "evening"),
		word: s(v)
	};
}
function p(e, t, r) {
	return e === "sandals" ? null : t <= n.thermalSocksAt || e === "snowboots" && r ? "socksThermal" : t <= n.woolSocksAt || e === "rainboots" && t < n.woolInRainBootsBelow ? "socksWool" : e === "sneakers" && t >= n.shortSocksFrom ? "socksShort" : "socksEveryday";
}
function m(e, t) {
	let n = Number(e.slice(5, 7));
	return t >= 0 ? n >= 6 && n <= 8 : n === 12 || n <= 2;
}
function h(e, t = {}) {
	let r = e.effective, i = e.rainy && !e.snow, o = i || (t.rainToday ?? !1), s, c = !1;
	s = r >= 24 ? ["tshirt"] : r >= 18 ? [r >= 20 ? "tshirt" : "longsleeve"] : r >= 12 ? ["tshirt", e.breezy ? "jacket" : "sweater"] : r >= 5 ? [
		"tshirt",
		"sweater",
		"jacket"
	] : r >= -5 ? [
		"tshirt",
		"sweater",
		"coat"
	] : [
		"tshirt",
		"longsleeve",
		"sweater",
		"coat"
	];
	let l;
	if (o) {
		let t = s[s.length - 1];
		t === "jacket" || t === "sweater" ? (s = [...s.slice(0, -1), "rainjacket"], c = !0, l = t) : i && s.length === 1 && (e.windy || e.storm) && (s = [...s, "rainjacket"]);
	}
	let u = [];
	r <= n.thermalsAt && u.push("thermals"), u.push(r >= n.shortsFrom && !e.snow ? "shorts" : "trousers"), e.snow && r <= n.snowPantsAt && u.push("snowpants");
	let d = s[s.length - 1], f = i && !e.windy && !e.storm, m = (i || e.snow) && !f && (d === "rainjacket" || d === "coat"), h = i && !f && d === "coat", g;
	g = e.snow || e.icy ? "snowboots" : r >= n.warmRainSandalsFrom ? "sandals" : i && (e.precipProbMax >= n.bootsProb || e.precipSum >= n.bootsMm && e.precipProbMax >= n.rainMmMinProb) ? "rainboots" : "sneakers";
	let _ = e.uvMax >= n.uvProtect, v = e.cloudAvg < n.sunnyCloud, y = e.uvMax >= (t.summer === !1 ? n.uvSunHatOffSeason : n.uvProtect), b = null;
	r <= n.beanieAt || e.breezy && r <= n.beanieWindyAt ? b = "beanie" : y && r >= n.sunHatFrom && v && !i && (b = e.windy ? "cap" : "sunhat");
	let x = (e, t, r) => e.some((e) => e >= r) && t.filter((e) => e >= r).length >= n.persistHours, S = [];
	(r <= n.scarfAt || e.breezy && r <= n.scarfWindyAt) && S.push("scarf"), (r <= n.glovesAt || e.breezy && r <= n.glovesWindyAt) && S.push("gloves");
	let C = a[t.eyes ?? "brown"], w = e.sunByHour !== null && e.daySunByHour !== null && x(e.sunByHour, e.daySunByHour, C.sunMinutes), T = v && x(e.uvByHour, e.dayUvByHour, C.uv);
	(w || T || e.snow && v) && S.push("sunglasses");
	let E = t.summer === !1 ? n.uvSunscreenOffSeason : n.uvProtect;
	x(e.uvByHour, e.dayUvByHour, E) && S.push("sunscreen"), x(e.tempByHour, e.dayTempByHour, n.waterFrom) && S.push("water"), t.forKids && (e.dark || e.fog) && S.push("reflector"), r <= n.handWarmersAt && S.push("handwarmers"), (r <= n.lipBalmAt && e.windy || e.snow && _ && v) && S.push("lipbalm"), x(e.tempByHour, e.dayTempByHour, n.fanFrom) && S.push("fan"), e.part === "evening" && !i && e.tempAvg >= n.repellentFrom && e.humidityAvg !== null && e.humidityAvg >= n.repellentHumidity && e.windMax < n.repellentMaxWind && S.push("repellent");
	let D = t.allergies ? n.maskParticlesSensitive : n.maskParticles;
	e.particlesMax !== null && e.particlesMax >= D && S.push("mask"), t.allergies && e.pollen !== null && e.pollen >= 1 && S.push("tissues"), e.precipSum >= (t.forKids ? n.spareSocksMm : n.spareSocksMmGrownUps) && S.push("socks");
	let O = p(g, r, u.includes("snowpants"));
	return {
		part: e.part,
		conditions: e,
		layers: s,
		swappedForRain: c,
		dryOuter: l,
		legs: u,
		shoes: g,
		socks: O,
		head: b,
		extras: S,
		umbrella: f,
		hood: m,
		waterproofCoat: h
	};
}
function g(e) {
	return e.snow || e.feelsMin < n.coldThemeBelow ? "cold" : e.icon === "cloud" || e.icon === "fog" || e.icon === "rain" || e.icon === "storm" || e.cloudAvg >= n.cloudyTheme ? "cloudy" : "sunny";
}
//#endregion
//#region src/engine/plan.ts
var _ = (e, t) => ({
	kind: "parts",
	parts: e,
	all: !t.single && e.length === t.total
}), v = (e) => ({
	kind: "item",
	item: e
}), y = [
	"sunscreen",
	"water",
	"socks",
	"lipbalm",
	"handwarmers",
	"repellent",
	"tissues"
], b = [
	"reflector",
	"umbrella",
	"poncho",
	"rainjacket",
	"coat",
	"jacket",
	"sweater",
	"longsleeve",
	"tshirt",
	"beanie",
	"gloves",
	"scarf",
	"handwarmers",
	"sunscreen",
	"water",
	"sunhat",
	"cap",
	"repellent",
	"mask",
	"tissues",
	"sunglasses",
	"lipbalm",
	"fan",
	"socks"
], x = (e, t) => S(e) - S(t);
function S(e) {
	let t = b.indexOf(e);
	return t < 0 ? b.length : t;
}
var C = [
	"jacket",
	"rainjacket",
	"coat"
], w = ["sunscreen", "repellent"];
function T(e) {
	return [
		...e.layers,
		...e.legs,
		...e.head ? [e.head] : [],
		...e.extras
	].filter((e) => !y.includes(e));
}
function E(e) {
	return [
		...e.layers,
		...e.head ? [e.head] : [],
		...e.extras,
		...e.umbrella ? ["umbrella"] : []
	];
}
function D(e, t, n) {
	let r = e.map(E), i = r.map((e) => e.filter((e) => !y.includes(e))), a = [...new Set(r.slice(1).flat())].filter((e) => !i[0].includes(e) && !y.includes(e)), o = y.filter((e) => (e !== "sunscreen" || n) && r.some((t) => t.includes(e))), s = [
		...i[0],
		...a,
		...o
	].sort(x), c = (t, n) => e.find((e, i) => i > n && r[i].includes(t))?.part, l = (n, i) => {
		if (y.includes(n) && r[i].includes(n)) {
			if (i > 0) return { kind: n };
			let t = e.length > 1 && r.every((e) => e.includes(n));
			return t ? {
				kind: n,
				allDay: t
			} : {
				kind: n,
				next: e[0].part,
				now: !0
			};
		}
		let a = c(n, i);
		return a ? n === "umbrella" && t ? {
			kind: n,
			next: a,
			window: t
		} : {
			kind: n,
			next: a
		} : { kind: n };
	};
	return e.map((e, t) => ({
		part: e.part,
		leaving: t === 0,
		out: t === 0 ? [] : i[t].filter((e) => !r[t - 1].includes(e)),
		in: t === 0 ? [] : i[t - 1].filter((e) => !i[t].includes(e)),
		bag: s.filter((e) => !i[t].includes(e)).map((e) => l(e, t))
	}));
}
function O(e) {
	let t = e.find((e) => e.id === "extras").items.find((e) => e.kind === "repellent");
	t?.active && (t.note = { kind: "apply" });
}
function ee(e, t, n) {
	let r = e.find((e) => e.id === "extras"), i = r.items.find((e) => e.kind === "sunscreen");
	if (!i || !i.active || !t || (i.note = t, !n)) return;
	let a = r.detail.findIndex((e) => e.key === "extras.detail.sun");
	n.replace && a >= 0 && (r.detail[a] = { key: "extras.detail.sunLater" }), n.extra && r.detail.splice(a >= 0 ? a + 1 : r.detail.length, 0, n.extra);
}
function k(r, i) {
	let a = i.fromHour ?? 0, o = t.map((e) => f(r, e, i.sensitivity, a)).filter((e) => e !== null);
	if (o.length === 0) return null;
	let s = o.some((e) => e.rainy && !e.snow), c = i.latitude === void 0 ? void 0 : m(r.date, i.latitude), l = i.forKids, u = i.allergies, d = i.eyes, v = o.map((e) => h(e, {
		rainToday: s,
		summer: c,
		forKids: l,
		allergies: u,
		eyes: d
	})), b = {
		total: v.length,
		single: !1
	}, x = (e) => {
		let t = e.layers[e.layers.length - 1];
		return C.includes(t) ? t : null;
	}, S = v.map(x).reduce((e, t) => t && (!e || C.indexOf(t) > C.indexOf(e)) ? t : e, null);
	if (S) for (let e of v) {
		let t = x(e);
		t && t !== S && (e.layers = [...e.layers.slice(0, -1), S], S === "coat" ? (e.swappedForRain = !1, e.dryOuter = void 0, e.waterproofCoat = e.conditions.rainy && !e.conditions.snow && !e.umbrella) : t === "jacket" && (e.swappedForRain = !0, e.dryOuter = "jacket"));
	}
	if (v.some((e) => e.hood)) for (let e of v) {
		let t = e.layers[e.layers.length - 1];
		e.umbrella && (t === "rainjacket" || t === "coat") && (e.umbrella = !1, e.hood = !0);
	}
	let E = [
		"sandals",
		"sneakers",
		"rainboots",
		"snowboots"
	], k = v.reduce((e, t) => E.indexOf(t.shoes) > E.indexOf(e) ? t.shoes : e, "sandals"), re = v.some((e) => e.legs.includes("trousers")), ie = v.some((e) => e.legs.includes("thermals")), ae = p(k, Math.min(...v.map((e) => e.conditions.effective)), v.some((e) => e.legs.includes("snowpants")));
	for (let e of v) e.shoes = k, e.socks = ae, re && (e.legs = e.legs.map((e) => e === "shorts" ? "trousers" : e)), ie && !e.legs.includes("thermals") && (e.legs = ["thermals", ...e.legs]), ae || (e.extras = e.extras.filter((e) => e !== "socks"));
	if (l) {
		let e = v.filter((e) => e.conditions.rainy && !e.conditions.snow && !e.umbrella);
		if (e.length > 0) {
			for (let e of v) e.layers[e.layers.length - 1] === "rainjacket" && (e.layers = e.dryOuter ? [...e.layers.slice(0, -1), e.dryOuter] : e.layers.slice(0, -1), e.swappedForRain = !1);
			for (let t of e) t.extras.push("poncho"), t.hood = !0;
		}
	}
	if (v.some((e) => e.layers[0] === "tshirt") && v.forEach((e, t) => {
		if (e.layers[0] !== "longsleeve") return;
		if (e.layers.length > 1) {
			e.layers = ["tshirt", ...e.layers];
			return;
		}
		let n = [v[t - 1], v[t + 1]].find((e) => e && e.layers.length > 1 && e.layers[0] === "tshirt");
		e.layers = ["tshirt", n ? n.layers[1] : "longsleeve"];
	}), v.some((e) => e.head === "beanie")) for (let e of v) (e.head === "sunhat" || e.head === "cap") && (e.head = null);
	if (v.some((e) => e.head === "cap")) for (let e of v) e.head === "sunhat" && (e.head = "cap");
	let j = c !== !1, oe = v.map((e) => e.extras.includes("sunscreen")), M = oe.indexOf(!0), N = !j && M > 0;
	if (N) {
		let e = v[0].extras.findIndex((e) => e === "water" || e === "reflector");
		v[0].extras.splice(e < 0 ? v[0].extras.length : e, 0, "sunscreen");
	}
	let ce = (e) => {
		if (v[e].extras.includes("sunscreen")) return j ? { kind: e === M ? "apply" : "reapply" } : { kind: e === 0 ? "applyOnce" : "applied" };
	}, P = s ? ne(r, a) : null, F = A(v, b, P);
	ee(F, M < 0 ? void 0 : { kind: j ? "reapply" : "applyOnce" }), O(F);
	let le = Math.max(...v.map((e) => e.conditions.gustMax)), I = v.some((e) => e.conditions.windy), L = v.some((e) => e.conditions.snow), ue = v.some((e) => e.umbrella), de = v.some((e) => e.hood), R = v.some((e) => e.conditions.storm), fe = v.some((e) => e.conditions.icy), pe = Math.max(...v.map((e) => e.conditions.uvMax)), me = v.find((e) => e.head === "sunhat" || e.head === "cap")?.head, z = v.some((e) => e.extras.includes("sunscreen")), he = v.some((e) => e.extras.includes("sunglasses")), ge = me ? `hl.${me === "cap" ? z ? "sun.cap" : "cap" : z ? "sun" : "sunhat"}` : z ? "hl.sunscreen" : he ? "hl.sunglasses" : null, _e = v.map((e) => e.layers.length), B = v[0], V = B.layers.length, ve = _e.some((e) => e !== V), H;
	H = V >= 4 ? "hl.bundle" : V === 3 ? "hl.wrap" : V === 2 ? "hl.layer" : B.layers[0] === "tshirt" ? "hl.tshirt" : "hl.light";
	let U = [ve ? {
		key: `${H}.when`,
		params: { when: _([B.part], b) }
	} : { key: H }];
	R ? U.push({ key: "hl.storm" }) : fe ? U.push({ key: "hl.icy" }) : de && !L ? U.push({ key: "hl.rainjacket" }) : ue ? U.push({ key: "hl.umbrella" }) : L ? U.push({ key: "hl.snow" }) : ge ? U.push({ key: ge }) : I ? U.push({ key: "hl.windy" }) : U.push({ key: "hl.dry" });
	let W = v.map((e) => e.conditions.word), G = [], ye = W.slice(1).find((e) => e !== W[0]);
	ye ? G.push({
		key: "sum.change",
		params: {
			from: {
				kind: "word",
				word: W[0]
			},
			to: {
				kind: "word",
				word: ye
			}
		}
	}) : G.push({
		key: "sum.same",
		params: { word: {
			kind: "word",
			word: W[0]
		} }
	}), L ? G.push({ key: "sum.snow" }) : P ? G.push({
		key: "sum.rain",
		params: { window: {
			kind: "window",
			...P
		} }
	}) : G.push({ key: "sum.dry" }), I && G.push({
		key: "sum.gusts",
		params: { speed: {
			kind: "speed",
			value: le
		} }
	});
	let K = [], q = v.map((e) => e.conditions.feelsMin), J = Math.min(...q), Y = Math.max(...q);
	if (K.push(J === Y ? {
		icon: "temp",
		msg: {
			key: "chip.feels",
			params: { value: {
				kind: "temp",
				value: J
			} }
		}
	} : {
		icon: "temp",
		msg: {
			key: "chip.feelsRange",
			params: {
				from: {
					kind: "temp",
					value: q[0]
				},
				to: {
					kind: "temp",
					value: q[0] === J ? Y : J
				}
			}
		}
	}), R && K.push({
		icon: "rain",
		msg: { key: "chip.storm" }
	}), fe && K.push({
		icon: "snow",
		msg: { key: "chip.icy" }
	}), L ? K.push({
		icon: "snow",
		msg: { key: "chip.snow" }
	}) : P ? K.push({
		icon: "rain",
		msg: {
			key: "chip.rain",
			params: { window: {
				kind: "window",
				...P
			} }
		}
	}) : K.push({
		icon: "dry",
		msg: { key: "chip.dry" }
	}), I) {
		let e = v.filter((e) => e.conditions.windy).map((e) => e.part);
		K.push({
			icon: "wind",
			msg: {
				key: "chip.windy",
				params: { when: _(e, b) }
			}
		});
	}
	pe >= n.uvProtect && K.push({
		icon: "sun",
		msg: {
			key: "chip.uv",
			params: { value: Math.round(pe) }
		}
	});
	let X = t.flatMap((e) => {
		let t = v.find((t) => t.part === e);
		if (t) return [{
			outfit: t,
			past: !1
		}];
		let n = f(r, e, i.sensitivity, 0);
		return n ? [{
			outfit: h(n, {
				rainToday: s,
				summer: c,
				forKids: l,
				allergies: u,
				eyes: d
			}),
			past: !0
		}] : [];
	}), Z = D(v, P, j), be = Z[0].bag, xe = X.map(({ outfit: e, past: t }) => {
		let n = t ? void 0 : Z.find((t) => t.part === e.part);
		return {
			part: e.part,
			icon: e.conditions.icon,
			layers: e.layers.length,
			feels: e.conditions.feelsMin,
			past: t,
			bag: n ? {
				pack: n.leaving ? n.bag.length : 0,
				out: n.out.length,
				in: n.in.length
			} : null
		};
	}), Q = (e) => {
		let t = X.findIndex((t) => t.outfit.part === e.part);
		if (t <= 0 || X[t - 1].past) return null;
		let n = X[t - 1].outfit, r = T(e), i = T(n);
		return {
			from: n.part,
			off: i.filter((e) => !r.includes(e)),
			on: r.filter((e) => !i.includes(e))
		};
	}, Se = v.map((t, n) => {
		let [i, o] = e[t.part], s = Q(t), c = t.conditions.rainy && !t.conditions.snow ? ne(r, Math.max(a, i), o) : null, l = () => A([t], {
			total: 1,
			single: !0
		}, c), u = l();
		s && te(u, s);
		let d = l(), f = n === 0 ? j ? {
			replace: !1,
			extra: oe.slice(1).some(Boolean) ? { key: "extras.detail.sunCarry" } : void 0
		} : {
			replace: N,
			extra: N ? void 0 : { key: "extras.detail.sunOnce" }
		} : void 0;
		for (let e of [d, u]) ee(e, ce(n), f), O(e);
		return {
			part: t.part,
			cards: d,
			cardsWithChanges: u,
			change: s,
			bag: Z[n]
		};
	}), Ce = v.map((e, t) => {
		let n = e.extras.filter((e) => e !== "poncho" && (!y.includes(e) || w.includes(e))), r = [
			...e.legs,
			...e.layers,
			...e.socks ? [e.socks] : [],
			e.shoes,
			...e.head ? [e.head] : [],
			...e.umbrella ? ["umbrella"] : [],
			...e.extras.includes("poncho") ? ["poncho"] : [],
			...n
		], i = e.conditions.rainy && !e.umbrella && !e.conditions.snow, a = i ? ["umbrella"] : [];
		for (let n of Q(e)?.off ?? []) !a.includes(n) && !Z[t].in.includes(n) && a.push(n);
		return {
			part: e.part,
			wear: r,
			skip: a,
			umbrellaTooWindy: i,
			storm: e.conditions.storm,
			bag: Z[t]
		};
	}), we = [
		...U,
		{
			key: "speech.wear",
			params: { items: {
				kind: "items",
				items: Ce[0].wear.filter((e) => e !== "umbrella" && e !== "socksEveryday")
			} }
		},
		...F[0].detail.slice(0, 1),
		F.find((e) => e.id === "rain").title
	];
	return be.length > 0 && we.push({
		key: "speech.bring",
		params: { items: {
			kind: "items",
			items: be.map((e) => e.kind)
		} }
	}), {
		date: r.date,
		parts: v,
		headline: U,
		summary: G,
		chips: K,
		strip: xe,
		cards: F,
		views: Se,
		kids: Ce,
		numbers: se(r, a),
		theme: g(B.conditions),
		speech: we
	};
}
function A(e, t, n) {
	let r = {
		parts: e,
		scope: t,
		presentIn: (t) => e.filter(t).map((e) => e.part),
		partialNote: (t) => t.length > 0 && t.length < e.length ? {
			kind: "parts",
			parts: t
		} : void 0
	}, i = Math.max(...e.map((e) => e.conditions.gustMax)), a = e.some((e) => e.conditions.breezy), o = e.some((e) => e.conditions.snow), s = e.some((e) => e.umbrella), c = e.some((e) => e.hood), l = Math.max(...e.map((e) => e.conditions.uvMax));
	return [
		re(r, a),
		ie(r),
		ae(e, n),
		j(r, c),
		oe(r, n, i, o, s, c),
		N(r, a, l)
	];
}
function te(e, { on: t, off: n }) {
	for (let r of e) for (let e of r.items) e.active && t.includes(e.kind) && !e.note && (e.note = { kind: "putOn" }), !e.active && n.includes(e.kind) && (e.note = { kind: "takeOff" });
	let r = e.find((e) => e.id === "layers");
	for (let e of n) o.includes(e) && !r.items.some((t) => t.kind === e) && r.items.push({
		kind: e,
		active: !1,
		note: { kind: "takeOff" }
	});
}
function ne(e, t, r = 22) {
	let i = e.hours.filter((e) => e.hour >= Math.max(t, 7) && e.hour < r && (e.precipProb >= n.rainProb || e.precip >= .2 && e.precipProb >= n.rainMmMinProb));
	return i.length === 0 ? null : {
		from: i[0].hour,
		to: i[i.length - 1].hour + 1
	};
}
function re({ parts: e, scope: n, presentIn: r, partialNote: i }, a) {
	let s = o.filter((t) => e.some((e) => e.layers.includes(t))), c = e.some((e) => e.swappedForRain), l = s.map((t) => {
		let n = i(r((e) => e.layers.includes(t))), a = n;
		!n && t === "rainjacket" && c && (a = { kind: "swapped" });
		let o = t === "coat" && e.some((e) => e.waterproofCoat) ? "label.waterproofCoat" : void 0;
		return {
			kind: t,
			active: !0,
			note: a,
			labelKey: o
		};
	}), u = s.includes("rainjacket") ? ["sweater", "coat"] : [
		"sweater",
		"jacket",
		"coat"
	];
	for (let e of u) {
		if (l.length >= 4) break;
		s.includes(e) || l.push({
			kind: e,
			active: !1
		});
	}
	let d = e.map((e) => e.layers.length), f = [];
	if (n.single) {
		let t = e[0], r = _([t.part], n);
		return f.push({
			key: "layers.detail.partWord",
			params: {
				word: {
					kind: "word",
					word: t.conditions.word
				},
				when: r
			}
		}), c ? f.push({ key: "layers.detail.rainOuter" }) : a && f.push({ key: "layers.detail.wind" }), {
			id: "layers",
			title: {
				key: "layers.title.part",
				params: {
					n: d[0],
					when: r
				}
			},
			detail: f,
			items: l
		};
	}
	let p = d[0], m = d.find((e) => e !== p), h = m === void 0 ? {
		key: "layers.title.same",
		params: { n: p }
	} : {
		key: "layers.title.change",
		params: {
			a: p,
			b: m
		}
	};
	for (let i of s) {
		if (f.length >= 2) break;
		let a = r((e) => e.layers.includes(i));
		if (a.length === e.length) continue;
		let o = e.map((e) => e.part).filter((e) => !a.includes(e));
		if (a.includes(e[0].part)) {
			let e = Math.max(...o.map((e) => t.indexOf(e))), r = a.filter((n) => t.indexOf(n) > e);
			f.push(r.length > 0 ? {
				key: "layers.detail.offBack",
				params: {
					item: v(i),
					off: _(o, n),
					back: _(r, n)
				}
			} : {
				key: "layers.detail.off",
				params: {
					item: v(i),
					when: _(o, n)
				}
			});
		} else f.push({
			key: "layers.detail.on",
			params: {
				item: v(i),
				when: _(a, n)
			}
		});
	}
	return f.length < 2 && c ? f.push({ key: "layers.detail.rainOuter" }) : f.length < 2 && a && f.push({ key: "layers.detail.wind" }), f.length === 0 && f.push({ key: "layers.detail.steady" }), {
		id: "layers",
		title: h,
		detail: f,
		items: l
	};
}
function ie({ parts: e, scope: t, presentIn: r, partialNote: i }) {
	let a = r((e) => e.legs.includes("trousers")), o = r((e) => e.conditions.effective >= n.shortsFrom && !e.conditions.snow), s = a.length > 0 ? "trousers" : "shorts", c = r((e) => e.legs.includes("thermals")), l = r((e) => e.legs.includes("snowpants")), u = [
		{
			kind: "shorts",
			active: s === "shorts"
		},
		{
			kind: "trousers",
			active: s === "trousers"
		},
		{
			kind: "thermals",
			active: c.length > 0,
			note: i(c)
		},
		{
			kind: "snowpants",
			active: l.length > 0,
			note: i(l)
		}
	], d = Math.min(...e.map((e) => e.conditions.effective)), f;
	f = l.length > 0 ? "snowpants" : c.length > 0 ? "thermals" : s === "shorts" ? "shorts" : d < 12 ? "warmTrousers" : "trousers";
	let p = [{ key: `legs.detail.${f}` }];
	return s === "trousers" && o.length > 0 && p.push({
		key: "legs.detail.shortsLater",
		params: { when: _(o, t) }
	}), {
		id: "legs",
		title: { key: `legs.title.${f}` },
		detail: p,
		items: u
	};
}
function ae(e, t) {
	let n = [
		"sandals",
		"sneakers",
		"rainboots",
		"snowboots"
	], r = e.reduce((e, t) => n.indexOf(t.shoes) > n.indexOf(e) ? t.shoes : e, "sandals"), i = e[0].socks, a = [i ? {
		kind: i,
		active: !0
	} : {
		kind: "socksEveryday",
		active: !1,
		labelKey: "label.socks"
	}, {
		kind: r,
		active: !0,
		note: r === "rainboots" && t ? {
			kind: "window",
			...t
		} : void 0
	}], o = r === "snowboots" && !e.some((e) => e.conditions.snow) && e.some((e) => e.conditions.icy), s;
	s = r === "rainboots" && t ? [{
		key: "shoes.detail.rainboots",
		params: { window: {
			kind: "window",
			...t
		} }
	}] : o ? [{ key: "shoes.detail.icy" }] : r === "sandals" && t ? [{ key: "shoes.detail.warmRain" }] : [{ key: `shoes.detail.${r}` }];
	let c = e.some((e) => e.legs.includes("snowpants"));
	return i ? i === "socksShort" ? s.push({ key: "feet.socks.short" }) : i === "socksWool" ? s.push({ key: r === "rainboots" ? "feet.socks.woolBoots" : "feet.socks.wool" }) : i === "socksThermal" && s.push({ key: r === "snowboots" && c ? "feet.socks.thermalSnow" : "feet.socks.thermal" }) : s.push({ key: "feet.socks.none" }), {
		id: "shoes",
		title: { key: i === "socksShort" ? "shoes.title.light" : `shoes.title.${r}` },
		detail: s,
		items: a
	};
}
function j({ parts: e, scope: t, presentIn: n, partialNote: r }, i) {
	let a = [
		"sunhat",
		"cap",
		"beanie"
	], o = a.map((e) => {
		let t = n((t) => t.head === e);
		return {
			kind: e,
			active: t.length > 0,
			note: r(t)
		};
	}), s = a.map((e) => ({
		k: e,
		ps: n((t) => t.head === e)
	})).filter((e) => e.ps.length > 0).sort((e, t) => t.ps.length - e.ps.length);
	if (s.length === 0) return {
		id: "head",
		title: { key: "head.title.none" },
		detail: [{ key: i ? "head.detail.hood" : "head.detail.none" }],
		items: o
	};
	let c = s[0], l = {
		key: `head.title.${c.k}`,
		params: { when: _(c.ps, t) }
	}, u = [];
	if (c.k === "beanie") {
		let t = e.filter((e) => e.head === "beanie");
		u.push({ key: t.some((e) => e.conditions.breezy) ? "head.detail.coldWind" : "head.detail.cold" });
	} else c.k === "sunhat" ? u.push({ key: "head.detail.sun" }) : u.push({ key: "head.detail.windySun" });
	return s[1] ? u.push({
		key: "head.detail.then",
		params: {
			item: v(s[1].k),
			when: _(s[1].ps, t)
		}
	}) : i && u.push({ key: "head.detail.hoodLater" }), {
		id: "head",
		title: l,
		detail: u,
		items: o
	};
}
function oe({ parts: e, scope: t, presentIn: n }, r, i, a, o, s) {
	let c = e.find((e) => e.hood), l = c ? c.extras.includes("poncho") ? "poncho" : c.layers[c.layers.length - 1] : "rainjacket", u = r ? {
		kind: "window",
		...r
	} : void 0;
	if (a) return {
		id: "rain",
		title: { key: "rain.title.snow" },
		detail: [{ key: "rain.detail.snow" }],
		items: [{
			kind: "umbrella",
			active: !1
		}, {
			kind: l,
			active: !0,
			labelKey: "label.hoodUp"
		}]
	};
	if (!r && !o && !s) return {
		id: "rain",
		title: { key: "rain.title.none" },
		detail: [{ key: "rain.detail.none" }],
		items: [{
			kind: "umbrella",
			active: !1
		}, {
			kind: "rainjacket",
			active: !1
		}]
	};
	if (e.some((e) => e.conditions.storm)) return {
		id: "rain",
		title: { key: "rain.title.storm" },
		detail: [{ key: "rain.detail.storm" }],
		items: [{
			kind: "umbrella",
			active: !1,
			note: { kind: "storm" }
		}, {
			kind: l,
			active: !0,
			labelKey: "label.hoodUp",
			note: u
		}]
	};
	let d = n((e) => e.umbrella), f = n((e) => e.hood), p = r ? {
		kind: "window",
		...r
	} : _(n((e) => e.conditions.rainy), t);
	if (s && !o) return {
		id: "rain",
		title: { key: "rain.title.skipUmbrella" },
		detail: [{
			key: "rain.detail.windy",
			params: { speed: {
				kind: "speed",
				value: i
			} }
		}],
		items: [{
			kind: "umbrella",
			active: !1,
			note: { kind: "tooWindy" }
		}, {
			kind: l,
			active: !0,
			labelKey: "label.hoodUp",
			note: u
		}]
	};
	let m = [{
		kind: "umbrella",
		active: !0,
		note: s ? {
			kind: "parts",
			parts: d
		} : u
	}], h = [{
		key: "rain.detail.window",
		params: { window: p }
	}];
	return s ? (m.push({
		kind: l,
		active: !0,
		labelKey: "label.hoodUp",
		note: {
			kind: "parts",
			parts: f
		}
	}), h.push({
		key: "rain.detail.windyLater",
		params: { when: _(f, t) }
	})) : m.push({
		kind: "rainjacket",
		active: e.some((e) => e.layers.includes("rainjacket"))
	}), {
		id: "rain",
		title: { key: "rain.title.umbrella" },
		detail: h,
		items: m
	};
}
var M = [
	"reflector",
	"poncho",
	"mask",
	"tissues",
	"water",
	"handwarmers",
	"lipbalm",
	"fan",
	"repellent",
	"socks"
];
function N({ parts: e, presentIn: t, partialNote: n }, r, i) {
	let a = [
		"scarf",
		"gloves",
		"sunglasses",
		"sunscreen"
	];
	for (let e of M) t((t) => t.extras.includes(e)).length > 0 && a.push(e);
	let o = a.map((e) => {
		let r = t((t) => t.extras.includes(e));
		return {
			kind: e,
			active: r.length > 0,
			note: n(r)
		};
	}), s = o.filter((e) => e.active).map((e) => e.kind), c = [];
	(s.includes("scarf") || s.includes("gloves")) && c.push({ key: r ? "extras.detail.coldWind" : "extras.detail.cold" }), s.includes("sunscreen") && c.push({
		key: "extras.detail.sun",
		params: { value: Math.round(i) }
	});
	for (let t of M) {
		if (!s.includes(t)) continue;
		let n = t === "socks" ? e[0].socks : null;
		c.push(n ? {
			key: "extras.detail.socks",
			params: { item: v(n) }
		} : { key: `extras.detail.${t}` });
	}
	return c.length === 0 && c.push({ key: "extras.detail.none" }), {
		id: "extras",
		title: s.length === 0 ? { key: "extras.title.none" } : {
			key: "extras.title.list",
			params: { items: {
				kind: "items",
				items: s
			} }
		},
		detail: c,
		items: o
	};
}
function se(e, t) {
	let n = e.hours.filter((e) => e.hour >= t), r = n.length > 0 ? n : e.hours, i = (e) => r.map(e);
	return {
		tempMin: Math.min(...i((e) => e.temp)),
		tempMax: Math.max(...i((e) => e.temp)),
		feelsMin: Math.min(...i((e) => e.feels)),
		feelsMax: Math.max(...i((e) => e.feels)),
		precipProbMax: Math.max(...i((e) => e.precipProb)),
		precipSum: i((e) => e.precip).reduce((e, t) => e + t, 0),
		windMax: Math.max(...i((e) => e.wind)),
		gustMax: Math.max(...i((e) => e.gusts)),
		uvMax: Math.max(...i((e) => e.uv)),
		sunrise: e.sunrise,
		sunset: e.sunset
	};
}
function ce(e, t, n) {
	if (e) try {
		let n = new Intl.DateTimeFormat("en-CA", {
			timeZone: e,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			hourCycle: "h23"
		}).formatToParts(new Date(t)), r = (e) => n.find((t) => t.type === e)?.value ?? "";
		return {
			date: `${r("year")}-${r("month")}-${r("day")}`,
			hour: Number(r("hour")),
			minute: Number(r("minute"))
		};
	} catch {}
	return n ? {
		date: n.slice(0, 10),
		hour: Number(n.slice(11, 13)),
		minute: Number(n.slice(14, 16))
	} : null;
}
function P(e, t, n) {
	let r = e.find((e) => e.date === t.date);
	if (!r) return null;
	let i = e.find((e) => e.date > r.date);
	return {
		today: k(r, {
			...n,
			fromHour: t.hour
		}),
		tomorrow: i ? k(i, n) : null
	};
}
var F = (e, t) => e.hour * 60 + e.minute >= 1170 && !!t?.tomorrow;
function le(e, t) {
	return F(e, t) || t !== null && t.today === null ? "tomorrow" : "today";
}
//#endregion
//#region src/engine/style.ts
var I = {
	girl: {
		tshirt: "top",
		sweater: "cardigan",
		shorts: "skirt",
		thermals: "tights",
		swimwear: "swimsuit",
		smartOutfit: "dress"
	},
	boy: {
		sweater: "hoodie",
		sunhat: "cap"
	}
};
function L(e, t) {
	return t === "neutral" ? e : I[t][e] ?? e;
}
var ue = (e) => e === "freezing" || e === "cold" || e === "chilly" ? "cold" : e === "hot" ? "hot" : "good", de = [
	{
		id: "en",
		name: "English"
	},
	{
		id: "de",
		name: "Deutsch"
	},
	{
		id: "fr",
		name: "Français"
	},
	{
		id: "es",
		name: "Español"
	},
	{
		id: "bg",
		name: "Български"
	}
], R = {
	"app.tagline": "Dress for the weather, not the numbers.",
	"mode.label": "Mode",
	"mode.everyone": "Grown-ups (12+)",
	"mode.kids": "Kids (3–12)",
	"day.today": "Today",
	"day.tomorrow": "Tomorrow",
	readAloud: "Read it to me",
	"readAloud.stop": "Stop reading",
	"item.socks": "Spare socks",
	"item.poncho": "Rain poncho",
	"item.lipbalm": "Lip balm",
	"item.handwarmers": "Hand warmers",
	"item.fan": "Hand fan",
	"item.repellent": "Insect repellent",
	"item.mask": "Face mask",
	"item.tissues": "Tissues",
	"extras.detail.socks": "Wet day: a spare pair of {item} in the bag.",
	"extras.detail.poncho": "Too windy for an umbrella: a poncho keeps you dry.",
	"extras.detail.lipbalm": "Cold wind or snow glare: lips dry out fast.",
	"extras.detail.handwarmers": "Freezing: hand warmers for your pockets.",
	"extras.detail.fan": "Very hot: a hand fan helps.",
	"extras.detail.repellent": "Warm, humid and calm: mosquitoes are out.",
	"extras.detail.mask": "Smoke or dust in the air: a mask helps.",
	"extras.detail.tissues": "High pollen: tissues and your allergy medicine.",
	"settings.allergies": "Allergies or asthma",
	"settings.yes": "Yes",
	"settings.no": "No",
	"settings.allergies.hint": "Adds tissues on high-pollen days, and a mask sooner when the air is poor.",
	"settings.eyes": "Eye colour",
	"settings.eyes.hint": "Lighter eyes feel glare sooner, so sunglasses come out sooner.",
	"settings.eyes.brown": "Brown",
	"settings.eyes.hazel": "Hazel",
	"settings.eyes.green": "Green",
	"settings.eyes.blue": "Blue",
	"learn.sense.socks": "Heavy rain: spare socks (kids sooner, they splash).",
	"learn.sense.poncho": "Kids, rain too windy for an umbrella: a poncho instead of a rain jacket.",
	"learn.sense.lipbalm": "Freezing gusts or snow glare: lip balm.",
	"learn.sense.handwarmers": "From {t} and colder: hand warmers.",
	"learn.sense.fan": "From {t} for a couple of hours: a hand fan.",
	"learn.sense.repellent": "Warm, humid, still evenings: insect repellent.",
	"learn.sense.mask": "Smoke or dust in the air: a face mask.",
	"learn.sense.tissues": "High pollen, with allergies on in Settings: tissues and medicine.",
	"note.apply": "apply",
	"note.reapply": "reapply",
	"note.applyOnce": "apply once",
	"note.applied": "already on",
	"bag.now": "now",
	"extras.detail.sunOnce": "Outside summer, once before you go is enough: no need to carry it.",
	"extras.detail.sunLater": "Strong sun later: put sunscreen on once, before you go.",
	"extras.detail.sunCarry": "Take it with you and reapply later.",
	"item.water": "Water bottle",
	"item.reflector": "Reflector",
	"hl.storm": "Thunderstorms: hood up, no umbrella.",
	"hl.icy": "Slippery out: wear boots with grip.",
	"chip.storm": "Thunderstorm",
	"chip.icy": "Icy",
	"note.storm": "lightning",
	"rain.title.storm": "Thunderstorm: no umbrella",
	"rain.detail.storm": "Hood up, and stay inside if you can.",
	"shoes.detail.icy": "Ice possible. Boots with a good grip.",
	"shoes.detail.warmRain": "Warm rain: sandals dry fast.",
	"label.waterproofCoat": "Waterproof coat",
	"extras.detail.water": "Hot out: drink plenty.",
	"extras.detail.reflector": "Dark or foggy: be easy to see.",
	"kids.storm": "Thunder! Hood up",
	"kids.sayStorm": "Thunder today: no umbrella, hood up!",
	"learn.sense.title": "Common sense",
	"learn.sense.storm": "Thunderstorm: no umbrella, hood up.",
	"learn.sense.ice": "Ice: boots with grip.",
	"learn.sense.glare": "Sun on snow: sunglasses.",
	"learn.sense.water": "From {t} for a couple of hours: a water bottle.",
	"learn.sense.warmRain": "Warm rain: sandals are fine.",
	"learn.sense.reflector": "Kids out in the dark before 18:00, or in fog: a reflector.",
	"settings.style.women": "Women’s",
	"settings.style.men": "Men’s",
	"settings.howItWorks": "How it works",
	"settings.appearance": "Appearance",
	"settings.appearance.auto": "Automatic",
	"settings.appearance.light": "Light",
	"settings.appearance.dark": "Dark",
	"card.title.bagged": "{items} in the bag",
	"privacy.title": "Privacy",
	"privacy.lead": "No accounts, no ads, no tracking and no cookies. What you set up stays on your device.",
	"privacy.device.title": "What stays on your device",
	"privacy.device.body": "Your settings, places, trips and ticks, your evening answers, and the kids’ checklist, best time and stickers are kept in this browser only. Nobody else can see them. “Reset the app” in Settings deletes them all.",
	"privacy.weather.title": "What is sent to get the weather",
	"privacy.weather.body": "To get the forecast, the air quality and the last few days’ weather, the app sends the place’s position to Open-Meteo (open-meteo.com). Past years’ weather for trips comes through our own server, which asks Open-Meteo once per place and keeps a copy for later trips there. When you search for a place, the words you type and the app’s language go there too. For places in the US, the position also goes to the US National Weather Service (weather.gov) for its warnings. Warnings in Europe come from MeteoAlarm through our own server, which asks only for your country’s warnings, never your position.",
	"privacy.location.title": "Your location",
	"privacy.location.body": "The app asks your device for its position only when you tap “Use my location”. Only its vicinity (within about 1 km) is kept, never the exact spot: it is saved on your device and sent, like any place, to get its weather. You can always pick a place by name instead.",
	"privacy.server.title": "Our server",
	"privacy.server.body": "The app comes from our own server, through Cloudflare. Like any website, they see your IP address and which files are loaded. This is only used to deliver the app and keep it safe, never to build a profile of you.",
	"privacy.links.title": "Shared links",
	"privacy.links.body": "A link you share holds only what is needed to open the same page: the place, the dates, and whether it is the Kids view. Never your other settings or anything about you.",
	"privacy.voice.title": "Read aloud",
	"privacy.voice.body": "Read aloud uses the voices on your device. Some browsers use online voices from their maker instead (Google’s in Chrome, for example), which receive the text being read.",
	"privacy.kids.title": "Children",
	"privacy.kids.body": "Kids mode collects nothing about the child. The checklist, the stopwatch and the stickers stay on the device.",
	"privacy.feedback.title": "Your evening answers",
	"privacy.feedback.body": "Your answers to “How did today’s advice work out?” stay on your device. If that ever changes, this notice will say so first.",
	"privacy.updated": "Last updated: 30 September 2026",
	"readAloud.short": "Listen",
	"evening.tomorrow": "It’s evening, so here’s tomorrow.",
	"evening.today": "Rest of today",
	"feedback.face.cold": "Too cold",
	"feedback.face.good": "Just right",
	"feedback.face.hot": "Too warm",
	"trip.when": "When?",
	"trip.recent": "Recent trips",
	"page.today": "Layers Weather - What should I wear and bring with me today?",
	"page.tomorrow": "Layers Weather - What should I wear and bring with me tomorrow?",
	"page.plan": "Layers Weather - What should I pack for my trip?",
	"page.learn": "Layers Weather - How does it work?",
	"trip.popular": "Popular",
	"trip.confidence": "Confidence {pct}",
	"trip.confidence.hint": "How far the weather can be trusted this far ahead: high for the next few days, lower after a week, and only a rough guide from past years beyond 16 days.",
	"trip.pickStart": "Tap the first day",
	"trip.pickEnd": "Now tap the last day",
	"trip.span": "{n|days}",
	"trip.prevMonth": "Previous month",
	"trip.nextMonth": "Next month",
	"trip.copied": "Copied",
	"share.copyLink": "Copy link",
	"link.viewing": "Viewing {place}",
	"link.keep": "Keep it",
	"link.back": "Back to {place}",
	"link.setup": "Set up for me",
	"link.sharedPlace": "Shared place",
	"link.kidsView": "Kids view",
	"link.grownUps": "Grown-ups view",
	"wiz.where.use": "Use {place}",
	"trip.act.edit": "Edit",
	"trip.act.share": "Share",
	"trip.act.clear": "Clear",
	"gate.title": "Grown-ups only",
	"gate.ask": "What is {a} times {b}?",
	"gate.wrong": "Not quite. Try again.",
	"gate.delete": "Delete",
	"face.cold": "Brrr, cold",
	"face.good": "Comfy",
	"face.hot": "Hot",
	"kids.sayWeather": "It’s {word} {when}.",
	"kids.onSay": "{item}, on!",
	"kids.packedSay": "{item}, in the bag!",
	"kids.tapToHear": "Tap to hear it",
	"learn.kids.rain": "Rain? Take your umbrella.",
	"learn.kids.windyRain": "Rain and strong wind? Hood up. No umbrella.",
	"learn.kids.wind": "Windy? Zip up your jacket.",
	"learn.kids.boots": "Puddles? Rain boots! Snow? Snow boots!",
	"learn.kids.sun": "Strong sun? Hat, sunscreen and sunglasses.",
	"gate.n3": "three",
	"gate.n4": "four",
	"gate.n5": "five",
	"gate.n6": "six",
	"gate.n7": "seven",
	"gate.n8": "eight",
	"gate.n9": "nine",
	"strip.label": "Your day",
	"strip.feels": "feels {value}",
	"noun.layers.one": "layer",
	"noun.layers.other": "layers",
	"part.morning": "Morning",
	"part.afternoon": "Afternoon",
	"part.evening": "Evening",
	"when.all": "all day",
	"when.morning": "in the morning",
	"when.afternoon": "in the afternoon",
	"when.evening": "in the evening",
	"short.morning": "morning",
	"short.afternoon": "afternoon",
	"short.evening": "evening",
	"word.freezing": "freezing",
	"word.cold": "cold",
	"word.chilly": "chilly",
	"word.cool": "cool",
	"word.mild": "mild",
	"word.warm": "warm",
	"word.hot": "hot",
	"item.tshirt": "T-shirt",
	"item.longsleeve": "Long sleeve",
	"item.sweater": "Sweater",
	"item.jacket": "Jacket",
	"item.rainjacket": "Rain jacket",
	"item.coat": "Winter coat",
	"item.sandals": "Sandals",
	"item.sneakers": "Sneakers",
	"item.rainboots": "Rain boots",
	"item.snowboots": "Snow boots",
	"item.sunhat": "Sun hat",
	"item.cap": "Cap",
	"item.beanie": "Beanie",
	"item.umbrella": "Umbrella",
	"item.sunglasses": "Sunglasses",
	"item.sunscreen": "Sunscreen",
	"item.scarf": "Scarf",
	"item.gloves": "Gloves",
	"item.shorts": "Shorts",
	"item.trousers": "Trousers",
	"item.thermals": "Thermals",
	"item.snowpants": "Snow pants",
	"card.legs": "Legs",
	"legs.title.shorts": "Shorts weather",
	"legs.title.trousers": "Long trousers",
	"legs.title.warmTrousers": "Warm trousers",
	"legs.title.thermals": "Trousers + thermals",
	"legs.title.snowpants": "Snow pants",
	"legs.detail.shorts": "Warm enough for bare legs.",
	"legs.detail.trousers": "Light trousers are enough.",
	"legs.detail.warmTrousers": "Jeans or something thicker.",
	"legs.detail.thermals": "Leggings or thermals under your trousers.",
	"legs.detail.snowpants": "Snow pants on top keep you warm and dry.",
	"legs.detail.shortsLater": "Warm enough for shorts {when}.",
	"strip.past": "over",
	"strip.pick": "Show what to wear for this part of the day",
	"view.heading": "What to wear {when}",
	"summary.open": "See more details for the day",
	"summary.close": "Hide details",
	"layers.title.part": "{n|layers} {when}",
	"layers.detail.partWord": "{word} {when}.",
	"note.takeOff": "take off",
	"note.putOn": "put on",
	"feedback.title": "How did today’s advice work out?",
	"feedback.kids.title": "Were you comfy today?",
	"feedback.thanks": "Thanks! That helps us get better.",
	"feedback.close": "Close",
	"feedback.face.meh": "Not quite",
	"feedback.why": "Were you too cold or too warm in what we suggested?",
	"feedback.kids.why": "Were you cold or hot?",
	"feedback.other": "Something else",
	"feedback.warmer": "Got it. From now on we’ll dress you a bit warmer.",
	"feedback.lighter": "Got it. From now on we’ll dress you a bit lighter.",
	"feedback.atWarmest": "Thanks! The advice is already at its warmest.",
	"feedback.atLightest": "Thanks! The advice is already at its lightest.",
	"feedback.undo": "Undo",
	"feedback.undone": "Undone. The advice stays as it was.",
	"wiz.hello": "Hi! Let’s set up Layers Weather",
	"wiz.step": "Step {n} of {total}",
	"wiz.who.title": "Who’s getting dressed?",
	"wiz.who.adult": "Me",
	"wiz.who.adult.sub": "12 or older · big words first, then the clothes",
	"wiz.who.kid": "My child",
	"wiz.who.kid.sub": "3 to 12 · just the clothes, as a checklist",
	"wiz.style.title": "Which clothes should we show?",
	"wiz.feel.title": "How do you usually feel outside?",
	"wiz.feel.cold": "I get cold easily",
	"wiz.feel.normal": "Just right",
	"wiz.feel.hot": "I run warm",
	"wiz.where.title": "Last thing: where are you?",
	"wiz.next": "Next",
	"install.title": "Keep it on your home screen",
	"install.why": "Open Layers Weather in one tap every morning, just like any other app.",
	"install.go": "Add to home screen",
	"install.later": "Not now",
	"install.ios.intro": "Two taps and it’s there:",
	"install.ios.share": "Tap the Share button",
	"install.ios.add": "Choose “Add to Home Screen”",
	"install.ok": "Got it",
	"install.link": "Install the app",
	"install.manual": "Open your browser’s menu (⋮ or ⋯) and choose “Install app” or “Add to Home screen”.",
	"wiz.back": "Back",
	"settings.reset": "Reset the app",
	"settings.refresh": "Refresh weather data",
	"settings.refresh.busy": "Refreshing…",
	"settings.refresh.done": "Weather updated",
	"settings.refresh.failed": "Couldn’t refresh. Check the connection.",
	"settings.reset.confirm": "This clears your settings, place and feedback on this device, and starts the setup again.",
	"settings.reset.yes": "Yes, reset",
	"settings.reset.cancel": "Cancel",
	"day.plan": "Trip",
	"brand.home": "Layers Weather, back to today",
	"day.learn": "Learn",
	"learn.title": "How to dress for any weather",
	"learn.sub": "The simple rules behind Layers Weather.",
	"learn.checks.title": "We check four things",
	"learn.check.feels": "How cold it feels",
	"learn.check.rain": "Rain or snow",
	"learn.check.wind": "Wind",
	"learn.check.sun": "Sun strength",
	"learn.checks.then": "…for the morning, the afternoon and the evening. Then we pick your clothes.",
	"learn.ladder.title": "The layer ladder",
	"learn.ladder.sub": "The colder it feels, the more layers you put on.",
	"learn.range.above": "{t} and up",
	"learn.range.between": "{from} to {to}",
	"learn.range.below": "below {t}",
	"learn.rung.hot": "T-shirt weather",
	"learn.rung.warm": "Light layers",
	"learn.rung.mild": "Add a light layer",
	"learn.rung.cool": "Three layers",
	"learn.rung.cold": "Winter coat, hat and scarf",
	"learn.rung.freezing": "Four layers and thermals",
	"learn.feels.title": "Feels like, not just the number",
	"learn.feels.wind": "Wind makes it feel colder.",
	"learn.feels.sun": "Sun makes it feel warmer.",
	"learn.feels.you": "Often cold, or often warm? Settings move the ladder by {n}.",
	"learn.rain.title": "Rain and wind",
	"learn.rain.calm": "Rain, little wind",
	"learn.rain.calmText": "Take an umbrella when the chance of rain is {p} or more.",
	"learn.rain.windy": "Rain and strong gusts",
	"learn.rain.windyText": "Gusts from {s} flip umbrellas. Wear a rain jacket with a hood.",
	"learn.wind.title": "Windy",
	"learn.wind.text": "From {s} of wind, pick an outer layer that blocks it. Wide hats blow away, so wear a cap.",
	"learn.boots.title": "Wet ground",
	"learn.boots.text": "Rain chance {p} or more: waterproof shoes. Snow: snow boots.",
	"learn.sun.title": "Strong sun",
	"learn.sun.text": "From UV {uv}: sun hat and sunscreen. Sunglasses when the sun shines for 2 hours or more, from UV {uv2} for 2 hours or more, or on sunny snow.",
	"learn.sun.season": "Outside summer, sunscreen only from UV {uv}, put on once before you go. In summer it goes in the bag, to reapply.",
	"learn.sun.hatCold": "A sun hat or cap only when it feels {t} or warmer, and outside summer from UV {uv}. One hat a day: if the day needs a beanie, the beanie is the hat.",
	"learn.legs.title": "Legs and feet",
	"learn.range.atOrBelow": "{t} and below",
	"learn.legs.snow": "Snow and {t} or colder",
	"learn.feet.sandals": "{t} and up, dry",
	"learn.feet.sneakers": "Most days",
	"learn.feet.rain": "Rain chance {p}+",
	"item.socksShort": "Short socks",
	"item.socksEveryday": "Everyday socks",
	"item.socksWool": "Wool socks",
	"item.socksThermal": "Thermal knee socks",
	"item.socksEveryday@kids": "Socks",
	"item.socksWool@kids": "Warm socks",
	"item.socksThermal@kids": "Snow socks",
	"shoes.title.light": "Light shoes",
	"label.socks": "Socks",
	"feet.socks.none": "No socks today.",
	"feet.socks.short": "Short socks keep feet cool in trainers.",
	"feet.socks.wool": "Cold day: wool socks keep toes warm.",
	"feet.socks.woolBoots": "Rubber boots don’t keep warm, so wool socks.",
	"feet.socks.thermal": "Freezing: thermal knee socks.",
	"feet.socks.thermalSnow": "Thermal knee socks keep snow out of the boots.",
	"learn.socks.title": "Socks",
	"learn.socks.noneLabel": "No socks",
	"learn.socks.none": "With sandals",
	"learn.socks.short": "In trainers, {t} and up all day",
	"learn.socks.everyday": "Most days",
	"learn.socks.wool": "{t} and below, or rain boots below {r}",
	"learn.socks.thermal": "{t} and below, or snow play",
	"learn.socks.note": "Picked once for the day, by its coldest hour. Boots never get short socks. A wet day’s spare pair is the same kind.",
	"learn.extras.title": "Cold-weather extras",
	"learn.extras.rule": "{t} and below ({w} when windy)",
	"learn.smart.title": "Two smart habits",
	"learn.smart.once": "Dress once for the day: if rain comes later, the rain jacket goes on in the morning.",
	"learn.smart.bag": "Not needed now, but later? It goes in your bag.",
	"bring.title": "Take with you",
	"bring.itemWindow": "{item} for {window}",
	"bring.itemPart": "{item} {when}",
	"bag.title": "Backpack {when}",
	"bag.out": "take out",
	"bag.in": "put in",
	"bag.stay": "in the bag",
	"bag.more": "+{n} more",
	"bag.less": "Show less",
	"bag.badge.pack": "{n} to pack",
	"bag.badge.out": "{n} out of the bag",
	"bag.badge.in": "{n} into the bag",
	"bag.sayOut": "Take out: {items}",
	"bag.sayIn": "Put in: {items}",
	"bag.sayStay": "Still in the bag: {items}",
	"kids.fromBag": "Take out of your bag and put on",
	"kids.intoBag": "Take off and put into your bag",
	"kids.stillInBag": "Still in your bag",
	"kids.sayStillInBag": "Still in your bag: {items}.",
	"kids.sayFromBag": "Take out of your bag and put on: {items}.",
	"kids.sayIntoBag": "Take off and put into your bag: {items}.",
	"kids.bag": "Pack into your bag",
	"kids.sayBag": "Pack into your bag: {items}.",
	"speech.bring": "Take with you: {items}.",
	"noun.days.one": "day",
	"noun.days.other": "days",
	"noun.pieces.one": "piece",
	"noun.pieces.other": "pieces",
	"trip.title": "Plan a trip",
	"trip.where": "Where are you going?",
	"trip.pack": "Pack for me",
	"trip.change": "Change trip",
	"trip.clear": "Clear trip",
	"trip.loading": "Checking the weather there…",
	"trip.error": "Couldn’t get the weather for this trip. Try again.",
	"trip.datesError": "Check your dates: up to 30 days, starting today or later.",
	"trip.headline": "{n|days} in {place}",
	"trip.count": "About {n|pieces} to pack",
	"trip.feels": "Feels like {from} to {to}.",
	"trip.chip.rain": "Rainy days: {n}",
	"trip.chip.sun": "Sunny days: {n}",
	"trip.chip.wind": "Windy days: {n}",
	"trip.chip.snow": "Snowy days: {n}",
	"trip.source.forecast": "Based on the forecast.",
	"trip.source.typical": "Too far ahead for a forecast, so this uses the weather on the same dates in the last ten years.",
	"trip.source.mixed": "Forecast until {date}. After that, typical weather: the same dates in the last ten years (the days with a dashed edge).",
	"trip.typicalDay": "typical weather",
	"trip.basics": "Plus underwear for {n|days}.",
	"trip.laundry": "Longer than a week, so we assume one wash.",
	"trip.packed": "{done} of {total} packed",
	"trip.packedLabel": "Packed",
	"trip.allPacked": "All packed!",
	"settings.kids": "Kids",
	"settings.clear.ticks": "Clear the checklist",
	"settings.clear.best": "Clear the best time",
	"settings.clear.stickers": "Clear the sticker book",
	"settings.clear.ticks.confirm": "Untick the kids’ checklist and reset the stopwatch?",
	"settings.clear.best.confirm": "Forget the fastest getting-ready time on this device?",
	"settings.clear.stickers.confirm": "Take every sticker out of the sticker book? This cannot be undone.",
	"settings.clear.yes": "Yes, clear",
	"settings.cleared": "Cleared",
	"trip.untickAll": "Untick everything",
	"trip.undoUntick": "Undo: tick them all again",
	"trip.unticked": "All unticked",
	"timer.start": "Start the timer",
	"timer.pause": "Pause the timer",
	"timer.resume": "Carry on",
	"timer.again": "Start again",
	"timer.hold": "Hold the stopwatch to start over",
	"timer.go": "Go!",
	"timer.started": "Timer started. Go!",
	"timer.paused": "Timer paused",
	"timer.resumed": "Timer on again",
	"timer.cleared": "All cleared. Start again when you’re ready.",
	"timer.readyIn": "Ready in {time}",
	"timer.newBest": "New best!",
	"timer.yourBest": "Your best is {time}",
	"timer.dur.s": "{s|seconds}",
	"timer.dur.m": "{m|minutes}",
	"timer.dur.ms": "{m|minutes} {s|seconds}",
	"noun.minutes.one": "minute",
	"noun.minutes.other": "minutes",
	"noun.seconds.one": "second",
	"noun.seconds.other": "seconds",
	"item.hikingBoots": "Hiking boots",
	"item.swimwear": "Swim shorts",
	"item.swimsuit": "Swimsuit",
	"item.flipflops": "Flip-flops",
	"item.goggles": "Ski goggles",
	"item.smartOutfit": "Smart shirt",
	"item.dress": "Dress",
	"item.smartShoes": "Smart shoes",
	"item.sportswear": "Sportswear",
	"item.runningShoes": "Running shoes",
	"item.dayBag": "Day bag",
	"item.towel": "Beach towel",
	"item.skiJacket": "Ski jacket",
	"item.skiPants": "Ski pants",
	"item.fleece": "Fleece",
	"item.headTorch": "Head torch",
	"item.cyclingShorts": "Cycling shorts",
	"item.bikeLight": "Bike light",
	"item.helmet": "Helmet",
	"act.hike": "Hiking",
	"act.beach": "Beach & swimming",
	"act.snow": "Snow & skiing",
	"act.out": "Going out",
	"act.sport": "Sport & running",
	"act.city": "City walking",
	"act.work": "Business",
	"act.camp": "Camping",
	"act.cycle": "Cycling",
	"act.level.1": "Once",
	"act.level.2": "A few days",
	"act.level.3": "Most days",
	"trip.what": "What will you do?",
	"trip.optional": "Optional",
	"trip.what.hint": "Tap an activity to add it, tap again for more days, and once more to remove it.",
	"trip.for": "for {what}",
	"trip.group.active": "Activity clothes",
	"trip.group.gear": "Gear",
	"kids.stickers.title": "My stickers",
	"kids.stickers.got": "You got a sticker!",
	"kids.stickers.count": "Stickers so far: {n}",
	"kids.stickers.empty": "Get ready in the morning, and today’s weather becomes your first sticker!",
	"kids.sticker.sun": "Sunny",
	"kids.sticker.partly": "Sun and clouds",
	"kids.sticker.cloud": "Cloudy",
	"kids.sticker.rain": "Rainy",
	"kids.sticker.snow": "Snowy",
	"kids.sticker.storm": "Stormy",
	"kids.sticker.fog": "Foggy",
	"kids.sticker.rainbow": "Rainbow",
	"kids.sticker.frost": "First frost!",
	"kids.sticker.shorts": "Shorts are back!",
	"cmp.warmer": "{deg} warmer than yesterday.",
	"cmp.warmer.today": "{deg} warmer than today.",
	"cmp.warmer.item": "{deg} warmer than yesterday: the {item} can stay home.",
	"cmp.warmer.item.today": "{deg} warmer than today: the {item} can stay home.",
	"cmp.colder": "{deg} colder than yesterday.",
	"cmp.colder.today": "{deg} colder than today.",
	"cmp.colder.item": "{deg} colder than yesterday: add the {item}.",
	"cmp.colder.item.today": "{deg} colder than today: add the {item}.",
	"cmp.rain": "Rain today, unlike yesterday: a waterproof layer on top.",
	"cmp.rain.today": "Rain tomorrow, unlike today: a waterproof layer on top.",
	"cmp.rain.umbrella": "Rain today, unlike yesterday: umbrella back in the bag.",
	"cmp.rain.umbrella.today": "Rain tomorrow, unlike today: umbrella back in the bag.",
	"cmp.dry": "Dry today after yesterday’s rain: no umbrella needed.",
	"cmp.dry.today": "Dry tomorrow after today’s rain: no umbrella needed.",
	"cmp.firstShorts": "Shorts are back! The first shorts day in over a month.",
	"cmp.firstFrost": "First frost in over a month: wrap up warm.",
	"cmp.firstCoat": "Coat weather is back: the first coat day in over a month.",
	"cmp.firstSunscreen": "Strong sun is back: sunscreen for the first time in over a month.",
	"cmp.kids.warmer": "Warmer than yesterday!",
	"cmp.kids.warmer.today": "Warmer tomorrow!",
	"cmp.kids.colder": "Colder than yesterday!",
	"cmp.kids.colder.today": "Colder tomorrow!",
	"cmp.kids.rain": "Rain today!",
	"cmp.kids.rain.today": "Rain tomorrow!",
	"cmp.kids.dry": "No rain today!",
	"cmp.kids.dry.today": "No rain tomorrow!",
	"cmp.kids.firstShorts": "Shorts are back!",
	"cmp.kids.firstFrost": "First frost!",
	"cmp.kids.firstCoat": "Coat time!",
	"cmp.kids.firstSunscreen": "Sunscreen time!",
	"ptr.pull": "Pull to refresh",
	"ptr.release": "Let go to refresh",
	"trip.packedCount": "{done} of {total}",
	"trip.days": "Your trip",
	"trip.group.tops": "Tops",
	"trip.group.warm": "Warm layers",
	"trip.group.legs": "Legs",
	"trip.group.shoes": "Feet",
	"trip.group.head": "Head",
	"trip.group.extras": "Accessories",
	"trip.item.packed": "{item} ×{qty}, packed",
	"trip.item.todo": "{item} ×{qty}, not packed yet",
	"item.top": "Top",
	"item.hoodie": "Hoodie",
	"item.skirt": "Skirt",
	"settings.style": "Clothes style",
	"settings.style.girl": "Girl",
	"settings.style.boy": "Boy",
	"hl.tshirt@girl": "Light top weather.",
	"hl.tshirt.when@girl": "Light top weather {when}.",
	"hl.sun@boy": "Cap and sunscreen.",
	"hl.sunhat@boy": "Cap on.",
	"head.title.sunhat@boy": "Cap {when}",
	"legs.title.shorts@girl": "Skirt weather",
	"legs.detail.shortsLater@girl": "Warm enough for a skirt {when}.",
	"item.cardigan": "Cardigan",
	"item.tights": "Tights",
	"legs.title.thermals@girl": "Trousers + tights",
	"legs.detail.thermals@girl": "Warm tights under your trousers.",
	"label.hoodUp": "Hood up",
	"note.swapped": "swapped",
	"note.tooWindy": "too windy",
	"state.on": "needed",
	"state.off": "not needed",
	"card.layers": "Layers",
	"card.shoes": "Feet",
	"card.head": "Head",
	"card.rain": "Rain",
	"card.extras": "Accessories",
	"hl.bundle": "Bundle up.",
	"hl.bundle.when": "Bundle up {when}.",
	"hl.wrap": "Wrap up warm.",
	"hl.wrap.when": "Wrap up {when}.",
	"hl.layer": "A light layer on top.",
	"hl.layer.when": "A light layer on top {when}.",
	"hl.tshirt": "T-shirt weather.",
	"hl.tshirt.when": "T-shirt weather {when}.",
	"hl.light": "Light layers.",
	"hl.light.when": "Light layers {when}.",
	"hl.rainjacket": "Rain jacket, not umbrella.",
	"hl.umbrella": "Take an umbrella.",
	"hl.snow": "Snow boots on.",
	"hl.sun": "Sun hat and sunscreen.",
	"hl.windy": "Windy: something wind-proof on top.",
	"hl.dry": "No rain expected.",
	"hl.sun.cap": "Cap and sunscreen.",
	"hl.sunhat": "Sun hat on.",
	"hl.cap": "Cap on.",
	"hl.sunscreen": "Sunscreen on.",
	"hl.sunglasses": "Sunglasses on.",
	"sum.change": "{from} at first, {to} later.",
	"sum.same": "{word} all day.",
	"sum.rain": "Rain {window}.",
	"sum.snow": "Snow on the way.",
	"sum.dry": "Staying dry.",
	"sum.gusts": "Gusts up to {speed}.",
	"chip.feels": "Feels {value}",
	"chip.feelsRange": "Feels {from} → {to}",
	"chip.rain": "Rain {window}",
	"chip.snow": "Snow",
	"chip.dry": "Dry",
	"chip.windy": "Windy {when}",
	"chip.uv": "UV {value}",
	"layers.title.same": "{n|layers} all day",
	"layers.title.change": "{a|layers}, then {b}",
	"layers.detail.off": "{item} off {when}.",
	"layers.detail.offBack": "{item} off {off}, back on {back}.",
	"layers.detail.on": "{item} on {when}.",
	"layers.detail.rainOuter": "Rain jacket as your outer layer today.",
	"layers.detail.wind": "Pick an outer layer that blocks the wind.",
	"layers.detail.steady": "No need to change during the day.",
	"shoes.title.sandals": "Sandals weather",
	"shoes.title.sneakers": "Everyday shoes",
	"shoes.title.rainboots": "Waterproof shoes",
	"shoes.title.snowboots": "Snow boots",
	"shoes.detail.sandals": "Warm and dry. Let your feet breathe.",
	"shoes.detail.sneakers": "Dry underfoot. Anything comfy works.",
	"shoes.detail.rainboots": "Puddles {window}. Keep your socks dry.",
	"shoes.detail.snowboots": "Snow on the ground. Warm, grippy boots.",
	"head.title.none": "No hat needed",
	"head.title.beanie": "Beanie {when}",
	"head.title.sunhat": "Sun hat {when}",
	"head.title.cap": "Cap {when}",
	"head.detail.cold": "Keeps the cold off your ears.",
	"head.detail.coldWind": "Cold wind, so cover your ears.",
	"head.detail.sun": "Strong sun. Shade your face and neck.",
	"head.detail.windySun": "Sunny but gusty, so a cap stays on better than a wide brim.",
	"head.detail.hood": "Your hood has the rain covered.",
	"head.detail.hoodLater": "Your hood covers you when it rains.",
	"head.detail.none": "Mild and not too sunny.",
	"head.detail.then": "{item} {when}.",
	"rain.title.none": "No rain expected",
	"rain.detail.none": "Leave the umbrella at home.",
	"rain.title.umbrella": "Take an umbrella",
	"rain.detail.window": "Rain {window}.",
	"rain.detail.windyLater": "Too windy for it {when}, so hood up then.",
	"rain.title.skipUmbrella": "Skip the umbrella",
	"rain.detail.windy": "Gusts up to {speed} will flip it. Hood up instead.",
	"rain.title.snow": "Snow on the way",
	"rain.detail.snow": "Hood up and zip to the top.",
	"extras.title.none": "Nothing extra",
	"extras.title.list": "{items}",
	"extras.detail.cold": "For the cold parts of the day.",
	"extras.detail.coldWind": "The wind makes it feel colder.",
	"extras.detail.sun": "UV reaches {value}. Protect your skin and eyes.",
	"extras.detail.none": "No sun gear needed.",
	"numbers.title": "Weather data",
	"numbers.summary": "{from} → {to} · rain {prob} · gusts {speed}",
	"numbers.temp": "Temperature",
	"numbers.feels": "Feels like",
	"numbers.rain": "Rain",
	"numbers.wind": "Wind",
	"numbers.uv": "UV index",
	"numbers.daylight": "Daylight",
	"numbers.sub.range": "lowest → highest",
	"numbers.sub.rain": "{amount} in total",
	"numbers.sub.gusts": "gusts up to {speed}",
	"numbers.sub.daylight": "sunrise – sunset",
	"uv.low": "low",
	"uv.moderate": "moderate",
	"uv.high": "high",
	"uv.veryHigh": "very high",
	"uv.extreme": "extreme",
	"kids.put": "Put on",
	"kids.notToday": "Not today",
	"kids.takeOff": "Take off",
	"kids.tooWindy": "Too windy",
	"kids.ready": "Ready to go!",
	"kids.readyTomorrow": "All set for tomorrow!",
	"kids.mute": "Mute the voice",
	"kids.progress": "{done} of {total}",
	"kids.getReady": "Getting ready",
	"kids.say": "Put on {items}.",
	"kids.sayUmbrella": "Take your umbrella.",
	"kids.sayNoUmbrella": "No umbrella today, it is too windy!",
	"kids.sayTakeOff": "Take off {items}.",
	"kids.itemOn": "{item}, on",
	"kids.itemNotYet": "{item}, not on yet",
	"kids.itemPacked": "{item}, packed",
	"kids.itemNotPacked": "{item}, not packed yet",
	"speech.wear": "Wear {items}.",
	"settings.open": "Settings",
	"settings.title": "Settings",
	"settings.language": "Language",
	"settings.units": "Units",
	"settings.metric": "°C · km/h · 24h",
	"settings.imperial": "°F · mph · 12h",
	"settings.feel": "I usually feel…",
	"settings.feel.cold": "Cold",
	"settings.feel.normal": "Just right",
	"settings.feel.hot": "Warm",
	"settings.done": "Done",
	"settings.credit": "Weather data by Open-Meteo.com (CC BY 4.0)",
	"loc.open": "Change place",
	"loc.title": "Where are you?",
	"loc.useMine": "Use my location",
	"loc.myLocation": "My location",
	"loc.here": "Here",
	"loc.search": "Search for a town or city",
	"loc.searching": "Searching…",
	"loc.noResults": "No places found",
	"loc.denied": "Location is off. Search for your town instead.",
	"loc.close": "Close",
	"status.loading": "Checking the sky…",
	"status.waitingNet": "Waiting for a connection…",
	"status.error": "Could not get the weather. Check your connection.",
	"status.retry": "Try again",
	"status.saved": "Showing the last saved forecast.",
	"warn.heading": "Official weather warnings",
	"warn.level.2": "Yellow warning",
	"warn.level.3": "Orange warning",
	"warn.level.4": "Red warning",
	"warn.type.0": "Weather",
	"warn.type.1": "Wind",
	"warn.type.2": "Snow and ice",
	"warn.type.3": "Thunderstorms",
	"warn.type.4": "Fog",
	"warn.type.5": "Heat",
	"warn.type.6": "Cold",
	"warn.type.7": "Coast",
	"warn.type.8": "Forest fires",
	"warn.type.9": "Avalanches",
	"warn.type.10": "Rain",
	"warn.type.12": "Flooding",
	"warn.type.13": "Rain and flooding",
	"warn.type.15": "Drought",
	"warn.until": "Until {time}",
	"warn.more": "Details",
	"warn.issued": "Issued by {sender}, {time}",
	"warn.source.meteoalarm": "More at meteoalarm.org",
	"warn.source.nws": "More at weather.gov",
	"warn.kids": "Ask a grown-up what to do.",
	"warn.credit": "Weather warnings: EUMETNET – MeteoAlarm and the national weather services; in the US, the National Weather Service. Region boundaries © EuroGeographics.",
	"a11y.skip": "Skip to content",
	"status.dayOver": "Today is almost over, so here is tomorrow."
}, fe = {
	en: R,
	de: {
		"app.tagline": "Zieh dich fürs Wetter an, nicht für die Zahlen.",
		"mode.label": "Modus",
		"mode.everyone": "Erwachsene (12+)",
		"mode.kids": "Kinder (3–12)",
		"day.today": "Heute",
		"day.tomorrow": "Morgen",
		readAloud: "Vorlesen",
		"readAloud.stop": "Vorlesen stoppen",
		"item.socks": "Ersatzsocken",
		"item.poncho": "Regenponcho",
		"item.lipbalm": "Lippenbalsam",
		"item.handwarmers": "Handwärmer",
		"item.fan": "Fächer",
		"item.repellent": "Mückenschutz",
		"item.mask": "Maske",
		"item.tissues": "Taschentücher",
		"extras.detail.socks": "Nasser Tag: ein Paar {item} extra in den Rucksack.",
		"extras.detail.poncho": "Zu windig für einen Schirm: ein Poncho hält trocken.",
		"extras.detail.lipbalm": "Kalter Wind oder Schneeglanz: Lippen trocknen schnell aus.",
		"extras.detail.handwarmers": "Eisig: Handwärmer für die Taschen.",
		"extras.detail.fan": "Sehr heiß: ein Fächer hilft.",
		"extras.detail.repellent": "Warm, feucht und windstill: Mücken sind unterwegs.",
		"extras.detail.mask": "Rauch oder Staub in der Luft: eine Maske hilft.",
		"extras.detail.tissues": "Viel Pollen: Taschentücher und dein Allergiemittel.",
		"settings.allergies": "Allergie oder Asthma",
		"settings.yes": "Ja",
		"settings.no": "Nein",
		"settings.allergies.hint": "Taschentücher an Tagen mit viel Pollen, und früher eine Maske bei schlechter Luft.",
		"settings.eyes": "Augenfarbe",
		"settings.eyes.hint": "Helle Augen sind blendempfindlicher, deshalb kommt die Sonnenbrille früher.",
		"settings.eyes.brown": "Braun",
		"settings.eyes.hazel": "Haselnuss",
		"settings.eyes.green": "Grün",
		"settings.eyes.blue": "Blau",
		"learn.sense.socks": "Starker Regen: Ersatzsocken (Kinder früher, sie planschen).",
		"learn.sense.poncho": "Kinder, Regen zu windig für einen Schirm: ein Poncho statt Regenjacke.",
		"learn.sense.lipbalm": "Eisige Böen oder Schneeglanz: Lippenbalsam.",
		"learn.sense.handwarmers": "Ab {t} und kälter: Handwärmer.",
		"learn.sense.fan": "Ab {t} für ein paar Stunden: ein Fächer.",
		"learn.sense.repellent": "Warme, feuchte, windstille Abende: Mückenschutz.",
		"learn.sense.mask": "Rauch oder Staub in der Luft: eine Maske.",
		"learn.sense.tissues": "Viel Pollen, mit Allergie in den Einstellungen: Taschentücher und Medikament.",
		"note.apply": "auftragen",
		"note.reapply": "nachcremen",
		"note.applyOnce": "einmal auftragen",
		"note.applied": "schon drauf",
		"bag.now": "jetzt",
		"extras.detail.sunOnce": "Außerhalb des Sommers reicht einmal vor dem Losgehen: nicht mitnehmen.",
		"extras.detail.sunLater": "Später starke Sonne: einmal Sonnencreme, bevor du losgehst.",
		"extras.detail.sunCarry": "Nimm sie mit und creme später nach.",
		"item.water": "Wasserflasche",
		"item.reflector": "Reflektor",
		"hl.storm": "Gewitter: Kapuze auf, kein Schirm.",
		"hl.icy": "Glatt draußen: Schuhe mit Profil.",
		"chip.storm": "Gewitter",
		"chip.icy": "Glatt",
		"note.storm": "Blitze",
		"rain.title.storm": "Gewitter: kein Schirm",
		"rain.detail.storm": "Kapuze auf, und bleib drinnen, wenn du kannst.",
		"shoes.detail.icy": "Glätte möglich. Stiefel mit gutem Profil.",
		"shoes.detail.warmRain": "Warmer Regen: Sandalen trocknen schnell.",
		"label.waterproofCoat": "Wasserfester Mantel",
		"extras.detail.water": "Heiß draußen: viel trinken.",
		"extras.detail.reflector": "Dunkel oder neblig: gut sichtbar sein.",
		"kids.storm": "Donner! Kapuze auf",
		"kids.sayStorm": "Heute gewittert es: kein Schirm, Kapuze auf!",
		"learn.sense.title": "Einfach logisch",
		"learn.sense.storm": "Gewitter: kein Schirm, Kapuze auf.",
		"learn.sense.ice": "Glätte: Stiefel mit Profil.",
		"learn.sense.glare": "Sonne auf Schnee: Sonnenbrille.",
		"learn.sense.water": "Ab {t} für ein paar Stunden: eine Wasserflasche.",
		"learn.sense.warmRain": "Warmer Regen: Sandalen gehen.",
		"learn.sense.reflector": "Kinder im Dunkeln vor 18 Uhr oder im Nebel: ein Reflektor.",
		"settings.style.women": "Damen",
		"settings.style.men": "Herren",
		"settings.howItWorks": "So funktioniert’s",
		"settings.appearance": "Darstellung",
		"settings.appearance.auto": "Automatisch",
		"settings.appearance.light": "Hell",
		"settings.appearance.dark": "Dunkel",
		"card.title.bagged": "{items} im Rucksack",
		"privacy.title": "Datenschutz",
		"privacy.lead": "Keine Konten, keine Werbung, kein Tracking und keine Cookies. Was du einstellst, bleibt auf deinem Gerät.",
		"privacy.device.title": "Was auf deinem Gerät bleibt",
		"privacy.device.body": "Deine Einstellungen, Orte, Reisen und Häkchen, deine Antworten am Abend sowie die Checkliste, die Bestzeit und die Sticker der Kinder werden nur in diesem Browser gespeichert. Niemand sonst kann sie sehen. „App zurücksetzen“ in den Einstellungen löscht alles.",
		"privacy.weather.title": "Was für das Wetter gesendet wird",
		"privacy.weather.body": "Für die Vorhersage, die Luftqualität und das Wetter der letzten Tage sendet die App die Position des Ortes an Open-Meteo (open-meteo.com). Das Wetter vergangener Jahre für Reisen kommt über unseren eigenen Server, der Open-Meteo einmal pro Ort fragt und eine Kopie für spätere Reisen dorthin behält. Suchst du einen Ort, gehen auch die eingegebenen Wörter und die Sprache der App dorthin. Bei Orten in den USA geht die Position außerdem für Warnungen an den US-Wetterdienst (weather.gov). Warnungen in Europa kommen von MeteoAlarm über unseren eigenen Server, der nur die Warnungen deines Landes abruft, nie deine Position.",
		"privacy.location.title": "Dein Standort",
		"privacy.location.body": "Die App fragt dein Gerät nur nach seiner Position, wenn du auf „Meinen Standort verwenden“ tippst. Behalten wird nur die Umgebung (auf etwa 1 km genau), nie der genaue Punkt: Sie wird auf deinem Gerät gespeichert und wie jeder Ort gesendet, um das Wetter dort zu holen. Du kannst stattdessen jederzeit einen Ort per Namen wählen.",
		"privacy.server.title": "Unser Server",
		"privacy.server.body": "Die App kommt von unserem eigenen Server, über Cloudflare. Wie bei jeder Website sehen sie deine IP-Adresse und welche Dateien geladen werden. Das dient nur dazu, die App auszuliefern und sicher zu halten, nie dazu, ein Profil von dir zu erstellen.",
		"privacy.links.title": "Geteilte Links",
		"privacy.links.body": "Ein geteilter Link enthält nur, was nötig ist, um dieselbe Seite zu öffnen: den Ort, die Daten und ob es die Kinderansicht ist. Nie deine anderen Einstellungen oder etwas über dich.",
		"privacy.voice.title": "Vorlesen",
		"privacy.voice.body": "Vorlesen nutzt die Stimmen deines Geräts. Manche Browser verwenden stattdessen Online-Stimmen ihres Herstellers (zum Beispiel Googles in Chrome), die den vorgelesenen Text erhalten.",
		"privacy.kids.title": "Kinder",
		"privacy.kids.body": "Der Kindermodus erfasst nichts über das Kind. Checkliste, Stoppuhr und Sticker bleiben auf dem Gerät.",
		"privacy.feedback.title": "Deine Antworten am Abend",
		"privacy.feedback.body": "Deine Antworten auf „Wie hat die Empfehlung heute gepasst?“ bleiben auf deinem Gerät. Sollte sich das je ändern, steht es zuerst hier.",
		"privacy.updated": "Zuletzt aktualisiert: 30. September 2026",
		"readAloud.short": "Anhören",
		"evening.tomorrow": "Es ist Abend, darum zeigen wir dir morgen.",
		"evening.today": "Rest von heute",
		"feedback.face.cold": "Zu kalt",
		"feedback.face.good": "Genau richtig",
		"feedback.face.hot": "Zu warm",
		"trip.when": "Wann?",
		"trip.recent": "Letzte Reisen",
		"page.today": "Layers Weather - Was soll ich heute anziehen und mitnehmen?",
		"page.tomorrow": "Layers Weather - Was soll ich morgen anziehen und mitnehmen?",
		"page.plan": "Layers Weather - Was soll ich für meine Reise einpacken?",
		"page.learn": "Layers Weather - Wie funktioniert das?",
		"trip.popular": "Beliebt",
		"trip.confidence": "Zuverlässigkeit {pct}",
		"trip.confidence.hint": "Wie sicher das Wetter so weit im Voraus ist: hoch für die nächsten Tage, geringer nach einer Woche, und ab 16 Tagen nur ein grober Anhaltspunkt aus früheren Jahren.",
		"trip.pickStart": "Tippe auf den ersten Tag",
		"trip.pickEnd": "Jetzt auf den letzten Tag tippen",
		"trip.span": "{n|days}",
		"trip.prevMonth": "Vorheriger Monat",
		"trip.nextMonth": "Nächster Monat",
		"trip.copied": "Kopiert",
		"share.copyLink": "Link kopieren",
		"link.viewing": "Du siehst {place}",
		"link.keep": "Übernehmen",
		"link.back": "Zurück zu {place}",
		"link.setup": "Für mich einrichten",
		"link.sharedPlace": "Geteilter Ort",
		"link.kidsView": "Kinderansicht",
		"link.grownUps": "Erwachsenenansicht",
		"wiz.where.use": "{place} verwenden",
		"trip.act.edit": "Ändern",
		"trip.act.share": "Teilen",
		"trip.act.clear": "Löschen",
		"gate.title": "Nur für Erwachsene",
		"gate.ask": "Wie viel ist {a} mal {b}?",
		"gate.wrong": "Nicht ganz. Versuch es noch mal.",
		"gate.delete": "Löschen",
		"face.cold": "Brrr, kalt",
		"face.good": "Angenehm",
		"face.hot": "Heiß",
		"kids.sayWeather": "Es ist {when} {word}.",
		"kids.onSay": "{item} ist an!",
		"kids.packedSay": "{item} ist eingepackt!",
		"kids.tapToHear": "Tippen zum Anhören",
		"learn.kids.rain": "Regen? Nimm deinen Schirm.",
		"learn.kids.windyRain": "Regen und starker Wind? Kapuze auf, kein Schirm.",
		"learn.kids.wind": "Windig? Mach die Jacke zu.",
		"learn.kids.boots": "Pfützen? Gummistiefel! Schnee? Schneestiefel!",
		"learn.kids.sun": "Starke Sonne? Hut, Sonnencreme und Sonnenbrille.",
		"gate.n3": "drei",
		"gate.n4": "vier",
		"gate.n5": "fünf",
		"gate.n6": "sechs",
		"gate.n7": "sieben",
		"gate.n8": "acht",
		"gate.n9": "neun",
		"strip.label": "Dein Tag",
		"strip.feels": "gefühlt {value}",
		"noun.layers.one": "Schicht",
		"noun.layers.other": "Schichten",
		"part.morning": "Morgen",
		"part.afternoon": "Nachmittag",
		"part.evening": "Abend",
		"when.all": "den ganzen Tag",
		"when.morning": "morgens",
		"when.afternoon": "nachmittags",
		"when.evening": "abends",
		"short.morning": "morgens",
		"short.afternoon": "nachmittags",
		"short.evening": "abends",
		"word.freezing": "eisig",
		"word.cold": "kalt",
		"word.chilly": "frisch",
		"word.cool": "kühl",
		"word.mild": "mild",
		"word.warm": "warm",
		"word.hot": "heiß",
		"item.tshirt": "T-Shirt",
		"item.longsleeve": "Langarmshirt",
		"item.sweater": "Pullover",
		"item.jacket": "Jacke",
		"item.rainjacket": "Regenjacke",
		"item.coat": "Wintermantel",
		"item.sandals": "Sandalen",
		"item.sneakers": "Turnschuhe",
		"item.rainboots": "Gummistiefel",
		"item.snowboots": "Winterstiefel",
		"item.sunhat": "Sonnenhut",
		"item.cap": "Kappe",
		"item.beanie": "Mütze",
		"item.umbrella": "Regenschirm",
		"item.sunglasses": "Sonnenbrille",
		"item.sunscreen": "Sonnencreme",
		"item.scarf": "Schal",
		"item.gloves": "Handschuhe",
		"item.shorts": "Shorts",
		"item.trousers": "Hose",
		"item.thermals": "Thermohose",
		"item.snowpants": "Schneehose",
		"card.legs": "Beine",
		"legs.title.shorts": "Shorts-Wetter",
		"legs.title.trousers": "Lange Hose",
		"legs.title.warmTrousers": "Warme Hose",
		"legs.title.thermals": "Hose + Thermohose",
		"legs.title.snowpants": "Schneehose",
		"legs.detail.shorts": "Warm genug für nackte Beine.",
		"legs.detail.trousers": "Eine leichte Hose reicht.",
		"legs.detail.warmTrousers": "Jeans oder etwas Dickeres.",
		"legs.detail.thermals": "Leggings oder Thermohose unter die Hose.",
		"legs.detail.snowpants": "Die Schneehose drüber hält warm und trocken.",
		"legs.detail.shortsLater": "{when} warm genug für Shorts.",
		"strip.past": "vorbei",
		"strip.pick": "Zeigen, was du in diesem Tagesabschnitt anziehst",
		"view.heading": "Was du {when} anziehst",
		"summary.open": "Mehr Details zum Tag",
		"summary.close": "Details ausblenden",
		"layers.detail.partWord": "{when} {word}.",
		"note.takeOff": "ausziehen",
		"note.putOn": "anziehen",
		"feedback.title": "Wie hat die Empfehlung heute gepasst?",
		"feedback.kids.title": "Hast du dich heute wohlgefühlt?",
		"feedback.thanks": "Danke! Das hilft uns, besser zu werden.",
		"feedback.close": "Schließen",
		"feedback.face.meh": "Nicht ganz",
		"feedback.why": "War dir mit unserem Vorschlag zu kalt oder zu warm?",
		"feedback.kids.why": "War dir kalt oder heiß?",
		"feedback.other": "Etwas anderes",
		"feedback.warmer": "Alles klar. Ab jetzt ziehen wir dich etwas wärmer an.",
		"feedback.lighter": "Alles klar. Ab jetzt ziehen wir dich etwas leichter an.",
		"feedback.atWarmest": "Danke! Wärmer geht die Empfehlung nicht.",
		"feedback.atLightest": "Danke! Leichter geht die Empfehlung nicht.",
		"feedback.undo": "Rückgängig",
		"feedback.undone": "Rückgängig gemacht. Die Empfehlung bleibt, wie sie war.",
		"wiz.hello": "Hallo! Lass uns Layers Weather einrichten",
		"wiz.step": "Schritt {n} von {total}",
		"wiz.who.title": "Wer zieht sich an?",
		"wiz.who.adult": "Ich",
		"wiz.who.adult.sub": "12 oder älter · erst große Worte, dann die Kleidung",
		"wiz.who.kid": "Mein Kind",
		"wiz.who.kid.sub": "3 bis 12 · nur die Kleidung, als Checkliste",
		"wiz.style.title": "Welche Kleidung sollen wir zeigen?",
		"wiz.feel.title": "Wie fühlst du dich draußen meistens?",
		"wiz.feel.cold": "Mir ist schnell kalt",
		"wiz.feel.normal": "Genau richtig",
		"wiz.feel.hot": "Mir ist schnell warm",
		"wiz.where.title": "Zum Schluss: Wo bist du?",
		"wiz.next": "Weiter",
		"install.title": "Leg es auf deinen Home-Bildschirm",
		"install.why": "Öffne Layers Weather jeden Morgen mit einem Tipp, wie jede andere App.",
		"install.go": "Zum Home-Bildschirm hinzufügen",
		"install.later": "Nicht jetzt",
		"install.ios.intro": "Zwei Tipps, und es ist da:",
		"install.ios.share": "Tippe auf „Teilen“",
		"install.ios.add": "Wähle „Zum Home-Bildschirm“",
		"install.ok": "Alles klar",
		"install.link": "App installieren",
		"install.manual": "Öffne das Menü deines Browsers (⋮ oder ⋯) und wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“.",
		"wiz.back": "Zurück",
		"settings.reset": "App zurücksetzen",
		"settings.refresh": "Wetterdaten aktualisieren",
		"settings.refresh.busy": "Wird aktualisiert…",
		"settings.refresh.done": "Wetter aktualisiert",
		"settings.refresh.failed": "Aktualisieren fehlgeschlagen. Prüfe die Verbindung.",
		"settings.reset.confirm": "Das löscht deine Einstellungen, deinen Ort und dein Feedback auf diesem Gerät und startet die Einrichtung neu.",
		"settings.reset.yes": "Ja, zurücksetzen",
		"settings.reset.cancel": "Abbrechen",
		"day.plan": "Reise",
		"brand.home": "Layers Weather, zurück zu heute",
		"day.learn": "Lernen",
		"learn.title": "So ziehst du dich für jedes Wetter an",
		"learn.sub": "Die einfachen Regeln hinter Layers Weather.",
		"learn.checks.title": "Wir prüfen vier Dinge",
		"learn.check.feels": "Wie kalt es sich anfühlt",
		"learn.check.rain": "Regen oder Schnee",
		"learn.check.wind": "Wind",
		"learn.check.sun": "Sonnenstärke",
		"learn.checks.then": "…für Morgen, Nachmittag und Abend. Dann wählen wir deine Kleidung.",
		"learn.ladder.title": "Die Schichten-Leiter",
		"learn.ladder.sub": "Je kälter es sich anfühlt, desto mehr Schichten.",
		"learn.range.above": "ab {t}",
		"learn.range.between": "{from} bis {to}",
		"learn.range.below": "unter {t}",
		"learn.rung.hot": "T-Shirt-Wetter",
		"learn.rung.warm": "Leichte Kleidung",
		"learn.rung.mild": "Eine leichte Schicht drüber",
		"learn.rung.cool": "Drei Schichten",
		"learn.rung.cold": "Wintermantel, Mütze und Schal",
		"learn.rung.freezing": "Vier Schichten und Thermo",
		"learn.feels.title": "Gefühlt, nicht nur die Zahl",
		"learn.feels.wind": "Wind macht es kälter.",
		"learn.feels.sun": "Sonne macht es wärmer.",
		"learn.feels.you": "Dir ist oft kalt oder warm? Die Einstellungen verschieben die Leiter um {n}.",
		"learn.rain.title": "Regen und Wind",
		"learn.rain.calm": "Regen, wenig Wind",
		"learn.rain.calmText": "Nimm einen Schirm, wenn die Regenwahrscheinlichkeit {p} oder mehr beträgt.",
		"learn.rain.windy": "Regen und starke Böen",
		"learn.rain.windyText": "Böen ab {s} klappen Schirme um. Trag eine Regenjacke mit Kapuze.",
		"learn.wind.title": "Windig",
		"learn.wind.text": "Ab {s} Wind eine winddichte Jacke wählen. Breite Hüte fliegen weg, also Kappe.",
		"learn.boots.title": "Nasser Boden",
		"learn.boots.text": "Ab {p} Regenwahrscheinlichkeit: wasserdichte Schuhe. Schnee: Winterstiefel.",
		"learn.sun.title": "Starke Sonne",
		"learn.sun.text": "Ab UV {uv}: Sonnenhut und Sonnencreme. Sonnenbrille, wenn die Sonne 2 Stunden oder länger scheint, ab UV {uv2} für 2 Stunden oder länger, oder bei Sonne auf Schnee.",
		"learn.sun.season": "Außerhalb des Sommers Sonnencreme erst ab UV {uv}, einmal vor dem Losgehen. Im Sommer kommt sie in den Rucksack, zum Nachcremen.",
		"learn.sun.hatCold": "Sonnenhut oder Kappe erst ab gefühlt {t}, außerhalb des Sommers ab UV {uv}. Eine Kopfbedeckung pro Tag: Braucht der Tag eine Mütze, bleibt es die Mütze.",
		"learn.legs.title": "Beine und Füße",
		"learn.range.atOrBelow": "{t} und kälter",
		"learn.legs.snow": "Schnee und {t} oder kälter",
		"learn.feet.sandals": "ab {t}, trocken",
		"learn.feet.sneakers": "Die meisten Tage",
		"learn.feet.rain": "Regen {p}+",
		"item.socksShort": "Kurze Socken",
		"item.socksEveryday": "Alltagssocken",
		"item.socksWool": "Wollsocken",
		"item.socksThermal": "Thermo-Kniestrümpfe",
		"item.socksEveryday@kids": "Socken",
		"item.socksWool@kids": "Warme Socken",
		"item.socksThermal@kids": "Schneesocken",
		"shoes.title.light": "Leichte Schuhe",
		"label.socks": "Socken",
		"feet.socks.none": "Heute ohne Socken.",
		"feet.socks.short": "Kurze Socken halten die Füße in Turnschuhen kühl.",
		"feet.socks.wool": "Kalter Tag: Wollsocken halten die Zehen warm.",
		"feet.socks.woolBoots": "Gummistiefel wärmen nicht, also Wollsocken.",
		"feet.socks.thermal": "Eisig: Thermo-Kniestrümpfe.",
		"feet.socks.thermalSnow": "Thermo-Kniestrümpfe halten den Schnee aus den Stiefeln.",
		"learn.socks.title": "Socken",
		"learn.socks.noneLabel": "Keine Socken",
		"learn.socks.none": "Zu Sandalen",
		"learn.socks.short": "In Turnschuhen, den ganzen Tag ab {t}",
		"learn.socks.everyday": "Die meisten Tage",
		"learn.socks.wool": "{t} und kälter, oder Gummistiefel unter {r}",
		"learn.socks.thermal": "{t} und kälter, oder Spielen im Schnee",
		"learn.socks.note": "Einmal für den Tag gewählt, nach seiner kältesten Stunde. Stiefel bekommen nie kurze Socken. Die Ersatzsocken an nassen Tagen sind von derselben Art.",
		"learn.extras.title": "Extras für die Kälte",
		"learn.extras.rule": "{t} und kälter ({w} bei Wind)",
		"learn.smart.title": "Zwei kluge Gewohnheiten",
		"learn.smart.once": "Einmal anziehen für den ganzen Tag: Kommt später Regen, gibt es morgens schon die Regenjacke.",
		"learn.smart.bag": "Jetzt nicht nötig, aber später? Ab in die Tasche.",
		"bring.title": "Nimm mit",
		"bring.itemWindow": "{item} für {window}",
		"bring.itemPart": "{item} {when}",
		"bag.title": "Rucksack {when}",
		"bag.out": "rausnehmen",
		"bag.in": "einpacken",
		"bag.stay": "im Rucksack",
		"bag.more": "+{n} mehr",
		"bag.less": "Weniger zeigen",
		"bag.badge.pack": "{n} einpacken",
		"bag.badge.out": "{n} aus dem Rucksack",
		"bag.badge.in": "{n} in den Rucksack",
		"bag.sayOut": "Rausnehmen: {items}",
		"bag.sayIn": "Einpacken: {items}",
		"bag.sayStay": "Bleibt im Rucksack: {items}",
		"kids.fromBag": "Aus der Tasche holen und anziehen",
		"kids.intoBag": "Ausziehen und in die Tasche packen",
		"kids.stillInBag": "Noch in der Tasche",
		"kids.sayStillInBag": "Noch in der Tasche: {items}.",
		"kids.sayFromBag": "Aus der Tasche holen und anziehen: {items}.",
		"kids.sayIntoBag": "Ausziehen und in die Tasche packen: {items}.",
		"kids.bag": "In die Tasche packen",
		"kids.sayBag": "In die Tasche packen: {items}.",
		"speech.bring": "Nimm mit: {items}.",
		"noun.days.one": "Tag",
		"noun.days.other": "Tage",
		"noun.pieces.one": "Teil",
		"noun.pieces.other": "Teile",
		"trip.title": "Reise planen",
		"trip.where": "Wohin geht’s?",
		"trip.pack": "Packliste erstellen",
		"trip.change": "Reise ändern",
		"trip.clear": "Reise löschen",
		"trip.loading": "Wir prüfen das Wetter dort…",
		"trip.error": "Das Wetter für diese Reise konnte nicht geladen werden. Versuch es nochmal.",
		"trip.datesError": "Prüfe die Daten: bis zu 30 Tage, ab heute.",
		"trip.headline": "{n|days} in {place}",
		"trip.count": "Etwa {n|pieces} einpacken",
		"trip.feels": "Gefühlt {from} bis {to}.",
		"trip.chip.rain": "Regentage: {n}",
		"trip.chip.sun": "Sonnentage: {n}",
		"trip.chip.wind": "Windige Tage: {n}",
		"trip.chip.snow": "Schneetage: {n}",
		"trip.source.forecast": "Laut Vorhersage.",
		"trip.source.typical": "Zu weit weg für eine Vorhersage, daher nutzen wir das Wetter an denselben Tagen der letzten zehn Jahre.",
		"trip.source.mixed": "Vorhersage bis {date}. Danach typisches Wetter: dieselben Tage der letzten zehn Jahre (die Tage mit gestricheltem Rand).",
		"trip.typicalDay": "typisches Wetter",
		"trip.basics": "Dazu Unterwäsche für {n|days}.",
		"trip.laundry": "Länger als eine Woche – wir rechnen mit einer Wäsche.",
		"trip.packed": "{done} von {total} eingepackt",
		"trip.packedLabel": "Eingepackt",
		"trip.allPacked": "Alles eingepackt!",
		"settings.kids": "Kinder",
		"settings.clear.ticks": "Checkliste leeren",
		"settings.clear.best": "Bestzeit löschen",
		"settings.clear.stickers": "Stickerbuch leeren",
		"settings.clear.ticks.confirm": "Alle Häkchen der Kinder-Checkliste entfernen und die Stoppuhr zurücksetzen?",
		"settings.clear.best.confirm": "Die schnellste Fertig-Zeit auf diesem Gerät vergessen?",
		"settings.clear.stickers.confirm": "Alle Sticker aus dem Stickerbuch nehmen? Das lässt sich nicht rückgängig machen.",
		"settings.clear.yes": "Ja, löschen",
		"settings.cleared": "Gelöscht",
		"trip.untickAll": "Alle Häkchen entfernen",
		"trip.undoUntick": "Rückgängig: alle wieder abhaken",
		"trip.unticked": "Alles abgewählt",
		"timer.start": "Stoppuhr starten",
		"timer.pause": "Stoppuhr anhalten",
		"timer.resume": "Weiter",
		"timer.again": "Noch einmal",
		"timer.hold": "Halte die Stoppuhr gedrückt, um neu anzufangen",
		"timer.go": "Los!",
		"timer.started": "Stoppuhr läuft. Los!",
		"timer.paused": "Stoppuhr angehalten",
		"timer.resumed": "Stoppuhr läuft weiter",
		"timer.cleared": "Alles gelöscht. Fang neu an, wenn du bereit bist.",
		"timer.readyIn": "Fertig in {time}",
		"timer.newBest": "Neuer Rekord!",
		"timer.yourBest": "Dein Rekord: {time}",
		"timer.dur.s": "{s|seconds}",
		"timer.dur.m": "{m|minutes}",
		"timer.dur.ms": "{m|minutes} {s|seconds}",
		"noun.minutes.one": "Minute",
		"noun.minutes.other": "Minuten",
		"noun.seconds.one": "Sekunde",
		"noun.seconds.other": "Sekunden",
		"item.hikingBoots": "Wanderschuhe",
		"item.swimwear": "Badeshorts",
		"item.swimsuit": "Badeanzug",
		"item.flipflops": "Flip-Flops",
		"item.goggles": "Skibrille",
		"item.smartOutfit": "Hemd",
		"item.dress": "Kleid",
		"item.smartShoes": "Elegante Schuhe",
		"item.sportswear": "Sportkleidung",
		"item.runningShoes": "Laufschuhe",
		"item.dayBag": "Tagesrucksack",
		"item.towel": "Strandtuch",
		"item.skiJacket": "Skijacke",
		"item.skiPants": "Skihose",
		"item.fleece": "Fleecejacke",
		"item.headTorch": "Stirnlampe",
		"item.cyclingShorts": "Radlerhose",
		"item.bikeLight": "Fahrradlicht",
		"item.helmet": "Helm",
		"act.hike": "Wandern",
		"act.beach": "Strand & Schwimmen",
		"act.snow": "Schnee & Ski",
		"act.out": "Ausgehen",
		"act.sport": "Sport & Laufen",
		"act.city": "Stadtbummel",
		"act.work": "Geschäftlich",
		"act.camp": "Camping",
		"act.cycle": "Radfahren",
		"act.level.1": "Einmal",
		"act.level.2": "Ein paar Tage",
		"act.level.3": "Die meisten Tage",
		"trip.what": "Was hast du vor?",
		"trip.optional": "Freiwillig",
		"trip.what.hint": "Tippe auf eine Aktivität, um sie hinzuzufügen, noch einmal für mehr Tage und ein weiteres Mal zum Entfernen.",
		"trip.for": "für {what}",
		"trip.group.active": "Kleidung für Aktivitäten",
		"trip.group.gear": "Ausrüstung",
		"kids.stickers.title": "Meine Sticker",
		"kids.stickers.got": "Du hast einen Sticker!",
		"kids.stickers.count": "Sticker bis jetzt: {n}",
		"kids.stickers.empty": "Zieh dich morgens fertig an, dann wird das Wetter von heute dein erster Sticker!",
		"kids.sticker.sun": "Sonnig",
		"kids.sticker.partly": "Sonne und Wolken",
		"kids.sticker.cloud": "Wolkig",
		"kids.sticker.rain": "Regnerisch",
		"kids.sticker.snow": "Schnee",
		"kids.sticker.storm": "Gewitter",
		"kids.sticker.fog": "Nebel",
		"kids.sticker.rainbow": "Regenbogen",
		"kids.sticker.frost": "Erster Frost!",
		"kids.sticker.shorts": "Kurze Hosen sind zurück!",
		"cmp.warmer": "{deg} wärmer als gestern.",
		"cmp.warmer.today": "{deg} wärmer als heute.",
		"cmp.warmer.item": "{deg} wärmer als gestern: {item} kann zu Hause bleiben.",
		"cmp.warmer.item.today": "{deg} wärmer als heute: {item} kann zu Hause bleiben.",
		"cmp.colder": "{deg} kälter als gestern.",
		"cmp.colder.today": "{deg} kälter als heute.",
		"cmp.colder.item": "{deg} kälter als gestern: {item} dazu.",
		"cmp.colder.item.today": "{deg} kälter als heute: {item} dazu.",
		"cmp.rain": "Heute Regen, anders als gestern: eine wasserdichte Schicht obendrauf.",
		"cmp.rain.today": "Morgen Regen, anders als heute: eine wasserdichte Schicht obendrauf.",
		"cmp.rain.umbrella": "Heute Regen, anders als gestern: der Schirm kommt wieder in den Rucksack.",
		"cmp.rain.umbrella.today": "Morgen Regen, anders als heute: der Schirm kommt wieder in den Rucksack.",
		"cmp.dry": "Heute trocken nach dem Regen gestern: kein Schirm nötig.",
		"cmp.dry.today": "Morgen trocken nach dem Regen heute: kein Schirm nötig.",
		"cmp.firstShorts": "Die kurzen Hosen sind zurück! Der erste Tag dafür seit über einem Monat.",
		"cmp.firstFrost": "Erster Frost seit über einem Monat: warm einpacken.",
		"cmp.firstCoat": "Mantelwetter ist zurück: der erste Manteltag seit über einem Monat.",
		"cmp.firstSunscreen": "Die starke Sonne ist zurück: Sonnencreme zum ersten Mal seit über einem Monat.",
		"cmp.kids.warmer": "Wärmer als gestern!",
		"cmp.kids.warmer.today": "Morgen wird es wärmer!",
		"cmp.kids.colder": "Kälter als gestern!",
		"cmp.kids.colder.today": "Morgen wird es kälter!",
		"cmp.kids.rain": "Heute regnet es!",
		"cmp.kids.rain.today": "Morgen regnet es!",
		"cmp.kids.dry": "Heute kein Regen!",
		"cmp.kids.dry.today": "Morgen kein Regen!",
		"cmp.kids.firstShorts": "Kurze Hosen sind zurück!",
		"cmp.kids.firstFrost": "Erster Frost!",
		"cmp.kids.firstCoat": "Zeit für den Mantel!",
		"cmp.kids.firstSunscreen": "Zeit für Sonnencreme!",
		"ptr.pull": "Zum Aktualisieren ziehen",
		"ptr.release": "Loslassen zum Aktualisieren",
		"trip.packedCount": "{done} von {total}",
		"trip.days": "Deine Reise",
		"trip.group.tops": "Oberteile",
		"trip.group.warm": "Warme Schichten",
		"trip.group.legs": "Beine",
		"trip.group.shoes": "Füße",
		"trip.group.head": "Kopf",
		"trip.group.extras": "Accessoires",
		"trip.item.packed": "{item} ×{qty}, eingepackt",
		"trip.item.todo": "{item} ×{qty}, noch nicht eingepackt",
		"item.top": "Top",
		"item.hoodie": "Hoodie",
		"item.skirt": "Rock",
		"settings.style": "Kleidungsstil",
		"settings.style.girl": "Mädchen",
		"settings.style.boy": "Junge",
		"hl.tshirt@girl": "Wetter für ein leichtes Top.",
		"hl.tshirt.when@girl": "{when} Wetter für ein leichtes Top.",
		"hl.sun@boy": "Kappe und Sonnencreme.",
		"hl.sunhat@boy": "Kappe auf.",
		"head.title.sunhat@boy": "Kappe {when}",
		"legs.title.shorts@girl": "Rockwetter",
		"legs.detail.shortsLater@girl": "{when} warm genug für einen Rock.",
		"item.cardigan": "Strickjacke",
		"item.tights": "Strumpfhose",
		"legs.title.thermals@girl": "Hose + Strumpfhose",
		"legs.detail.thermals@girl": "Eine warme Strumpfhose unter die Hose.",
		"label.hoodUp": "Kapuze auf",
		"note.swapped": "getauscht",
		"note.tooWindy": "zu windig",
		"state.on": "nötig",
		"state.off": "nicht nötig",
		"card.layers": "Schichten",
		"card.shoes": "Füße",
		"card.head": "Kopf",
		"card.rain": "Regen",
		"card.extras": "Accessoires",
		"hl.bundle": "Dick einpacken.",
		"hl.bundle.when": "{when} dick einpacken.",
		"hl.wrap": "Zieh dich warm an.",
		"hl.wrap.when": "Zieh dich {when} warm an.",
		"hl.layer": "Eine leichte Schicht drüber.",
		"hl.layer.when": "{when} eine leichte Schicht drüber.",
		"hl.tshirt": "T-Shirt-Wetter.",
		"hl.tshirt.when": "{when} T-Shirt-Wetter.",
		"hl.light": "Leichte Kleidung.",
		"hl.light.when": "{when} leichte Kleidung.",
		"hl.rainjacket": "Regenjacke statt Schirm.",
		"hl.umbrella": "Nimm einen Schirm mit.",
		"hl.snow": "Winterstiefel an.",
		"hl.sun": "Sonnenhut und Sonnencreme.",
		"hl.windy": "Windig: etwas Winddichtes obendrüber.",
		"hl.dry": "Kein Regen in Sicht.",
		"hl.sun.cap": "Kappe und Sonnencreme.",
		"hl.sunhat": "Sonnenhut auf.",
		"hl.cap": "Kappe auf.",
		"hl.sunscreen": "Sonnencreme drauf.",
		"hl.sunglasses": "Sonnenbrille auf.",
		"sum.change": "Erst {from}, später {to}.",
		"sum.same": "Den ganzen Tag {word}.",
		"sum.rain": "Regen {window}.",
		"sum.snow": "Schnee ist unterwegs.",
		"sum.dry": "Es bleibt trocken.",
		"sum.gusts": "Böen bis {speed}.",
		"chip.feels": "Gefühlt {value}",
		"chip.feelsRange": "Gefühlt {from} → {to}",
		"chip.rain": "Regen {window}",
		"chip.snow": "Schnee",
		"chip.dry": "Trocken",
		"chip.windy": "Windig {when}",
		"layers.title.same": "{n|layers} den ganzen Tag",
		"layers.title.change": "{a|layers}, dann {b}",
		"layers.detail.off": "{item} {when} ausziehen.",
		"layers.detail.offBack": "{item} {off} aus, {back} wieder an.",
		"layers.detail.on": "{item} {when} anziehen.",
		"layers.detail.rainOuter": "Heute die Regenjacke als äußere Schicht.",
		"layers.detail.wind": "Wähle eine winddichte äußere Schicht.",
		"layers.detail.steady": "Kein Umziehen nötig.",
		"shoes.title.sandals": "Sandalenwetter",
		"shoes.title.sneakers": "Normale Schuhe",
		"shoes.title.rainboots": "Wasserdichte Schuhe",
		"shoes.title.snowboots": "Winterstiefel",
		"shoes.detail.sandals": "Warm und trocken. Lass die Füße atmen.",
		"shoes.detail.sneakers": "Trockene Wege. Alles Bequeme passt.",
		"shoes.detail.rainboots": "Pfützen {window}. Halte die Socken trocken.",
		"shoes.detail.snowboots": "Schnee liegt. Warme Stiefel mit Profil.",
		"head.title.none": "Keine Mütze nötig",
		"head.title.beanie": "Mütze {when}",
		"head.title.sunhat": "Sonnenhut {when}",
		"head.title.cap": "Kappe {when}",
		"head.detail.cold": "Hält die Ohren warm.",
		"head.detail.coldWind": "Kalter Wind, also Ohren bedecken.",
		"head.detail.sun": "Starke Sonne. Schütze Gesicht und Nacken.",
		"head.detail.windySun": "Sonnig, aber böig. Eine Kappe hält besser als ein breiter Hut.",
		"head.detail.hood": "Die Kapuze schützt vor Regen.",
		"head.detail.hoodLater": "Bei Regen hilft die Kapuze.",
		"head.detail.none": "Mild und nicht zu sonnig.",
		"rain.title.none": "Kein Regen erwartet",
		"rain.detail.none": "Der Schirm bleibt zu Hause.",
		"rain.title.umbrella": "Schirm mitnehmen",
		"rain.detail.window": "Regen {window}.",
		"rain.detail.windyLater": "{when} zu windig dafür, dann Kapuze auf.",
		"rain.title.skipUmbrella": "Lass den Schirm da",
		"rain.detail.windy": "Böen bis {speed} klappen ihn um. Lieber Kapuze auf.",
		"rain.title.snow": "Schnee ist unterwegs",
		"rain.detail.snow": "Kapuze auf und bis oben zumachen.",
		"extras.title.none": "Nichts extra",
		"extras.detail.cold": "Für die kalten Stunden.",
		"extras.detail.coldWind": "Der Wind macht es kälter.",
		"extras.detail.sun": "UV bis {value}. Haut und Augen schützen.",
		"extras.detail.none": "Kein Sonnenschutz nötig.",
		"numbers.title": "Wetterdaten",
		"numbers.summary": "{from} → {to} · Regen {prob} · Böen {speed}",
		"numbers.temp": "Temperatur",
		"numbers.feels": "Gefühlt",
		"numbers.rain": "Regen",
		"numbers.wind": "Wind",
		"numbers.uv": "UV-Index",
		"numbers.daylight": "Tageslicht",
		"numbers.sub.range": "tiefste → höchste",
		"numbers.sub.rain": "{amount} insgesamt",
		"numbers.sub.gusts": "Böen bis {speed}",
		"numbers.sub.daylight": "Sonnenaufgang – Sonnenuntergang",
		"uv.low": "niedrig",
		"uv.moderate": "mittel",
		"uv.high": "hoch",
		"uv.veryHigh": "sehr hoch",
		"uv.extreme": "extrem",
		"kids.put": "Anziehen",
		"kids.notToday": "Heute nicht",
		"kids.takeOff": "Ausziehen",
		"kids.tooWindy": "Zu windig",
		"kids.ready": "Fertig zum Losgehen!",
		"kids.readyTomorrow": "Alles bereit für morgen!",
		"kids.mute": "Stimme stumm schalten",
		"kids.progress": "{done} von {total}",
		"kids.getReady": "Fertig machen",
		"kids.say": "Zieh {items} an.",
		"kids.sayUmbrella": "Nimm deinen Schirm mit.",
		"kids.sayNoUmbrella": "Heute kein Schirm, es ist zu windig!",
		"kids.sayTakeOff": "Zieh {items} aus.",
		"kids.itemOn": "{item}, an",
		"kids.itemNotYet": "{item}, noch nicht an",
		"kids.itemPacked": "{item}, eingepackt",
		"kids.itemNotPacked": "{item}, noch nicht eingepackt",
		"speech.wear": "Zieh {items} an.",
		"settings.open": "Einstellungen",
		"settings.title": "Einstellungen",
		"settings.language": "Sprache",
		"settings.units": "Einheiten",
		"settings.feel": "Mir ist meistens…",
		"settings.feel.cold": "Kalt",
		"settings.feel.normal": "Genau richtig",
		"settings.feel.hot": "Warm",
		"settings.done": "Fertig",
		"settings.credit": "Wetterdaten von Open-Meteo.com (CC BY 4.0)",
		"loc.open": "Ort ändern",
		"loc.title": "Wo bist du?",
		"loc.useMine": "Meinen Standort verwenden",
		"loc.myLocation": "Mein Standort",
		"loc.here": "Hier",
		"loc.search": "Ort suchen",
		"loc.searching": "Suche…",
		"loc.noResults": "Keine Orte gefunden",
		"loc.denied": "Standort ist aus. Suche stattdessen deinen Ort.",
		"loc.close": "Schließen",
		"status.loading": "Wir schauen in den Himmel…",
		"status.waitingNet": "Warte auf eine Verbindung…",
		"status.error": "Das Wetter konnte nicht geladen werden. Prüfe deine Verbindung.",
		"status.retry": "Nochmal versuchen",
		"status.saved": "Zeige die zuletzt gespeicherte Vorhersage.",
		"warn.heading": "Amtliche Wetterwarnungen",
		"warn.level.2": "Gelbe Warnung",
		"warn.level.3": "Orange Warnung",
		"warn.level.4": "Rote Warnung",
		"warn.type.0": "Wetter",
		"warn.type.1": "Wind",
		"warn.type.2": "Schnee und Eis",
		"warn.type.3": "Gewitter",
		"warn.type.4": "Nebel",
		"warn.type.5": "Hitze",
		"warn.type.6": "Kälte",
		"warn.type.7": "Küste",
		"warn.type.8": "Waldbrand",
		"warn.type.9": "Lawinen",
		"warn.type.10": "Regen",
		"warn.type.12": "Hochwasser",
		"warn.type.13": "Regen und Hochwasser",
		"warn.type.15": "Dürre",
		"warn.until": "Bis {time}",
		"warn.more": "Details",
		"warn.issued": "Herausgegeben von {sender}, {time}",
		"warn.source.meteoalarm": "Mehr auf meteoalarm.org",
		"warn.source.nws": "Mehr auf weather.gov",
		"warn.kids": "Frag einen Erwachsenen, was zu tun ist.",
		"warn.credit": "Wetterwarnungen: EUMETNET – MeteoAlarm und die nationalen Wetterdienste; in den USA der National Weather Service. Regionsgrenzen © EuroGeographics.",
		"a11y.skip": "Zum Inhalt springen",
		"status.dayOver": "Der Tag ist fast vorbei, hier ist morgen."
	},
	fr: {
		"app.tagline": "Habille-toi pour la météo, pas pour les chiffres.",
		"mode.label": "Mode",
		"mode.everyone": "Grands (12+)",
		"mode.kids": "Enfants (3–12)",
		"day.today": "Aujourd'hui",
		"day.tomorrow": "Demain",
		readAloud: "Lis-le-moi",
		"readAloud.stop": "Arrêter la lecture",
		"item.socks": "Chaussettes de rechange",
		"item.poncho": "Poncho de pluie",
		"item.lipbalm": "Baume à lèvres",
		"item.handwarmers": "Chauffe-mains",
		"item.fan": "Éventail",
		"item.repellent": "Anti-moustique",
		"item.mask": "Masque",
		"item.tissues": "Mouchoirs",
		"extras.detail.socks": "Journée mouillée : une paire de {item} de rechange dans le sac.",
		"extras.detail.poncho": "Trop de vent pour un parapluie : un poncho garde au sec.",
		"extras.detail.lipbalm": "Vent froid ou neige au soleil : les lèvres sèchent vite.",
		"extras.detail.handwarmers": "Glacial : des chauffe-mains pour les poches.",
		"extras.detail.fan": "Très chaud : un éventail aide.",
		"extras.detail.repellent": "Chaud, humide et sans vent : les moustiques sont de sortie.",
		"extras.detail.mask": "Fumée ou poussière dans l’air : un masque aide.",
		"extras.detail.tissues": "Beaucoup de pollen : mouchoirs et ton traitement anti-allergie.",
		"settings.allergies": "Allergies ou asthme",
		"settings.yes": "Oui",
		"settings.no": "Non",
		"settings.allergies.hint": "Des mouchoirs les jours de pollen, et un masque plus tôt quand l’air est mauvais.",
		"settings.eyes": "Couleur des yeux",
		"settings.eyes.hint": "Les yeux clairs sont plus sensibles à l’éblouissement : les lunettes de soleil arrivent plus tôt.",
		"settings.eyes.brown": "Marron",
		"settings.eyes.hazel": "Noisette",
		"settings.eyes.green": "Vert",
		"settings.eyes.blue": "Bleu",
		"learn.sense.socks": "Grosse pluie : chaussettes de rechange (plus tôt pour les enfants, ils sautent dans les flaques).",
		"learn.sense.poncho": "Enfants, trop de vent pour un parapluie : un poncho à la place de l’imperméable.",
		"learn.sense.lipbalm": "Rafales glaciales ou neige au soleil : baume à lèvres.",
		"learn.sense.handwarmers": "À {t} et moins : chauffe-mains.",
		"learn.sense.fan": "Dès {t} pendant quelques heures : un éventail.",
		"learn.sense.repellent": "Soirées chaudes, humides et sans vent : anti-moustique.",
		"learn.sense.mask": "Fumée ou poussière dans l’air : un masque.",
		"learn.sense.tissues": "Beaucoup de pollen, avec allergies dans les réglages : mouchoirs et traitement.",
		"note.apply": "à mettre",
		"note.reapply": "à remettre",
		"note.applyOnce": "une fois",
		"note.applied": "déjà mise",
		"bag.now": "maintenant",
		"extras.detail.sunOnce": "Hors été, une fois avant de partir suffit : inutile de l’emporter.",
		"extras.detail.sunLater": "Soleil fort plus tard : mets de la crème une fois, avant de partir.",
		"extras.detail.sunCarry": "Emporte-la et remets-en plus tard.",
		"item.water": "Gourde",
		"item.reflector": "Réflecteur",
		"hl.storm": "Orages : capuche, pas de parapluie.",
		"hl.icy": "Ça glisse : des bottes qui accrochent.",
		"chip.storm": "Orage",
		"chip.icy": "Verglas",
		"note.storm": "éclairs",
		"rain.title.storm": "Orage : pas de parapluie",
		"rain.detail.storm": "Capuche, et reste à l’intérieur si tu peux.",
		"shoes.detail.icy": "Risque de verglas. Des bottes qui accrochent.",
		"shoes.detail.warmRain": "Pluie chaude : les sandales sèchent vite.",
		"label.waterproofCoat": "Manteau imperméable",
		"extras.detail.water": "Il fait chaud : bois beaucoup.",
		"extras.detail.reflector": "Sombre ou brumeux : sois bien visible.",
		"kids.storm": "Tonnerre ! Capuche",
		"kids.sayStorm": "Il y a de l’orage : pas de parapluie, mets ta capuche !",
		"learn.sense.title": "Bon sens",
		"learn.sense.storm": "Orage : pas de parapluie, capuche.",
		"learn.sense.ice": "Verglas : des bottes qui accrochent.",
		"learn.sense.glare": "Soleil sur la neige : lunettes de soleil.",
		"learn.sense.water": "Dès {t} pendant quelques heures : une gourde.",
		"learn.sense.warmRain": "Pluie chaude : les sandales, ça va.",
		"learn.sense.reflector": "Enfants dehors dans le noir avant 18 h, ou dans le brouillard : un réflecteur.",
		"settings.style.women": "Femme",
		"settings.style.men": "Homme",
		"settings.howItWorks": "Comment ça marche",
		"settings.appearance": "Apparence",
		"settings.appearance.auto": "Automatique",
		"settings.appearance.light": "Clair",
		"settings.appearance.dark": "Sombre",
		"card.title.bagged": "{items} dans le sac",
		"privacy.title": "Confidentialité",
		"privacy.lead": "Pas de compte, pas de pub, pas de pistage et pas de cookies. Ce que tu règles reste sur ton appareil.",
		"privacy.device.title": "Ce qui reste sur ton appareil",
		"privacy.device.body": "Tes réglages, lieux, voyages et coches, tes réponses du soir, ainsi que la liste, le meilleur temps et les autocollants des enfants sont gardés dans ce navigateur uniquement. Personne d’autre ne peut les voir. « Réinitialiser l’app » dans les réglages efface tout.",
		"privacy.weather.title": "Ce qui est envoyé pour la météo",
		"privacy.weather.body": "Pour obtenir les prévisions, la qualité de l’air et la météo des derniers jours, l’appli envoie la position du lieu à Open-Meteo (open-meteo.com). La météo des années passées pour les voyages passe par notre propre serveur, qui interroge Open-Meteo une fois par lieu et en garde une copie pour les voyages suivants. Quand tu cherches un lieu, les mots tapés et la langue de l’appli y sont aussi envoyés. Pour les lieux aux États-Unis, la position va aussi au service météo américain (weather.gov) pour ses alertes. En Europe, les alertes viennent de MeteoAlarm via notre propre serveur, qui ne demande que les alertes de ton pays, jamais ta position.",
		"privacy.location.title": "Ta position",
		"privacy.location.body": "L’appli ne demande sa position à ton appareil que si tu touches « Utiliser ma position ». Seuls les environs (à environ 1 km près) sont gardés, jamais le point exact : ils sont gardés sur ton appareil et envoyés, comme tout lieu, pour obtenir leur météo. Tu peux toujours choisir un lieu par son nom à la place.",
		"privacy.server.title": "Notre serveur",
		"privacy.server.body": "L’appli vient de notre propre serveur, via Cloudflare. Comme pour tout site, ils voient ton adresse IP et les fichiers chargés. Cela sert uniquement à fournir l’appli et à la protéger, jamais à établir un profil de toi.",
		"privacy.links.title": "Liens partagés",
		"privacy.links.body": "Un lien partagé ne contient que ce qu’il faut pour ouvrir la même page : le lieu, les dates et s’il s’agit de la vue Enfants. Jamais tes autres réglages ni rien sur toi.",
		"privacy.voice.title": "Lecture à voix haute",
		"privacy.voice.body": "La lecture utilise les voix de ton appareil. Certains navigateurs utilisent à la place les voix en ligne de leur éditeur (celles de Google dans Chrome, par exemple), qui reçoivent le texte lu.",
		"privacy.kids.title": "Enfants",
		"privacy.kids.body": "Le mode Enfants ne collecte rien sur l’enfant. La liste, le chrono et les autocollants restent sur l’appareil.",
		"privacy.feedback.title": "Tes réponses du soir",
		"privacy.feedback.body": "Tes réponses à « Nos conseils du jour t’ont-ils aidé ? » restent sur ton appareil. Si cela change un jour, cette page le dira d’abord.",
		"privacy.updated": "Dernière mise à jour : 30 septembre 2026",
		"readAloud.short": "Écouter",
		"evening.tomorrow": "C’est le soir : voici demain.",
		"evening.today": "La fin de la journée",
		"feedback.face.cold": "Trop froid",
		"feedback.face.good": "Parfait",
		"feedback.face.hot": "Trop chaud",
		"trip.when": "Quand ?",
		"trip.recent": "Voyages récents",
		"page.today": "Layers Weather - Que porter et emporter aujourd’hui ?",
		"page.tomorrow": "Layers Weather - Que porter et emporter demain ?",
		"page.plan": "Layers Weather - Que mettre dans ma valise ?",
		"page.learn": "Layers Weather - Comment ça marche ?",
		"trip.popular": "Populaires",
		"trip.confidence": "Fiabilité {pct}",
		"trip.confidence.hint": "La fiabilité de la météo aussi loin à l’avance : élevée pour les prochains jours, moindre après une semaine, et au-delà de 16 jours, une simple indication tirée des années passées.",
		"trip.pickStart": "Touche le premier jour",
		"trip.pickEnd": "Touche maintenant le dernier jour",
		"trip.span": "{n|days}",
		"trip.prevMonth": "Mois précédent",
		"trip.nextMonth": "Mois suivant",
		"trip.copied": "Copié",
		"share.copyLink": "Copier le lien",
		"link.viewing": "Vous regardez {place}",
		"link.keep": "Garder",
		"link.back": "Retour à {place}",
		"link.setup": "Configurer pour moi",
		"link.sharedPlace": "Lieu partagé",
		"link.kidsView": "Vue enfants",
		"link.grownUps": "Vue adultes",
		"wiz.where.use": "Utiliser {place}",
		"trip.act.edit": "Modifier",
		"trip.act.share": "Partager",
		"trip.act.clear": "Effacer",
		"gate.title": "Réservé aux grands",
		"gate.ask": "Combien font {a} fois {b} ?",
		"gate.wrong": "Pas tout à fait. Réessaie.",
		"gate.delete": "Effacer",
		"face.cold": "Brrr, froid",
		"face.good": "Agréable",
		"face.hot": "Chaud",
		"kids.sayWeather": "Il fait {word} {when}.",
		"kids.onSay": "{item} : c’est mis !",
		"kids.packedSay": "{item} : dans le sac !",
		"kids.tapToHear": "Touche pour écouter",
		"learn.kids.rain": "Il pleut ? Prends ton parapluie.",
		"learn.kids.windyRain": "Pluie et vent fort ? Capuche sur la tête, pas de parapluie.",
		"learn.kids.wind": "Du vent ? Ferme bien ta veste.",
		"learn.kids.boots": "Des flaques ? Bottes de pluie ! De la neige ? Bottes de neige !",
		"learn.kids.sun": "Grand soleil ? Chapeau, crème solaire et lunettes de soleil.",
		"gate.n3": "trois",
		"gate.n4": "quatre",
		"gate.n5": "cinq",
		"gate.n6": "six",
		"gate.n7": "sept",
		"gate.n8": "huit",
		"gate.n9": "neuf",
		"strip.label": "Ta journée",
		"strip.feels": "ressenti {value}",
		"noun.layers.one": "couche",
		"noun.layers.other": "couches",
		"part.morning": "Matin",
		"part.afternoon": "Après-midi",
		"part.evening": "Soir",
		"when.all": "toute la journée",
		"when.morning": "le matin",
		"when.afternoon": "l'après-midi",
		"when.evening": "le soir",
		"short.morning": "matin",
		"short.afternoon": "après-midi",
		"short.evening": "soir",
		"word.freezing": "glacial",
		"word.cold": "froid",
		"word.chilly": "frisquet",
		"word.cool": "frais",
		"word.mild": "doux",
		"word.warm": "chaud",
		"word.hot": "très chaud",
		"item.tshirt": "T-shirt",
		"item.longsleeve": "Manches longues",
		"item.sweater": "Pull",
		"item.jacket": "Veste",
		"item.rainjacket": "Imperméable",
		"item.coat": "Manteau d'hiver",
		"item.sandals": "Sandales",
		"item.sneakers": "Baskets",
		"item.rainboots": "Bottes de pluie",
		"item.snowboots": "Bottes de neige",
		"item.sunhat": "Chapeau",
		"item.cap": "Casquette",
		"item.beanie": "Bonnet",
		"item.umbrella": "Parapluie",
		"item.sunglasses": "Lunettes de soleil",
		"item.sunscreen": "Crème solaire",
		"item.scarf": "Écharpe",
		"item.gloves": "Gants",
		"item.shorts": "Short",
		"item.trousers": "Pantalon",
		"item.thermals": "Collant thermique",
		"item.snowpants": "Pantalon de ski",
		"card.legs": "Jambes",
		"legs.title.shorts": "Temps à short",
		"legs.title.trousers": "Pantalon long",
		"legs.title.warmTrousers": "Pantalon chaud",
		"legs.title.thermals": "Pantalon + collant thermique",
		"legs.title.snowpants": "Pantalon de ski",
		"legs.detail.shorts": "Assez chaud pour les jambes nues.",
		"legs.detail.trousers": "Un pantalon léger suffit.",
		"legs.detail.warmTrousers": "Un jean ou plus épais.",
		"legs.detail.thermals": "Un collant ou un thermique sous le pantalon.",
		"legs.detail.snowpants": "Le pantalon de ski par-dessus garde au chaud et au sec.",
		"legs.detail.shortsLater": "Assez chaud pour un short {when}.",
		"strip.past": "passé",
		"strip.pick": "Voir quoi mettre à ce moment de la journée",
		"view.heading": "Quoi mettre {when}",
		"summary.open": "Plus de détails sur la journée",
		"summary.close": "Masquer le détail",
		"layers.detail.partWord": "{word} {when}.",
		"note.takeOff": "à enlever",
		"note.putOn": "à mettre",
		"feedback.title": "Nos conseils du jour t’ont-ils aidé ?",
		"feedback.kids.title": "Tu étais bien habillé aujourd’hui ?",
		"feedback.thanks": "Merci ! Ça nous aide à progresser.",
		"feedback.close": "Fermer",
		"feedback.face.meh": "Pas vraiment",
		"feedback.why": "Avais-tu trop froid ou trop chaud avec nos conseils ?",
		"feedback.kids.why": "Tu avais froid ou chaud ?",
		"feedback.other": "Autre chose",
		"feedback.warmer": "Compris. Désormais, on t’habillera un peu plus chaudement.",
		"feedback.lighter": "Compris. Désormais, on t’habillera un peu plus légèrement.",
		"feedback.atWarmest": "Merci ! Les conseils sont déjà au plus chaud.",
		"feedback.atLightest": "Merci ! Les conseils sont déjà au plus léger.",
		"feedback.undo": "Annuler",
		"feedback.undone": "Annulé. Les conseils restent comme avant.",
		"wiz.hello": "Bonjour ! Configurons Layers Weather",
		"wiz.step": "Étape {n} sur {total}",
		"wiz.who.title": "Qui s’habille ?",
		"wiz.who.adult": "Moi",
		"wiz.who.adult.sub": "12 ans ou plus · d’abord les mots, puis les vêtements",
		"wiz.who.kid": "Mon enfant",
		"wiz.who.kid.sub": "De 3 à 12 ans · juste les vêtements, en liste à cocher",
		"wiz.style.title": "Quels vêtements afficher ?",
		"wiz.feel.title": "Dehors, d’habitude, tu as…",
		"wiz.feel.cold": "Vite froid",
		"wiz.feel.normal": "Ni chaud ni froid",
		"wiz.feel.hot": "Vite chaud",
		"wiz.where.title": "Dernière chose : où es-tu ?",
		"wiz.next": "Suivant",
		"install.title": "Ajoute-la à ton écran d’accueil",
		"install.why": "Ouvre Layers Weather d’un geste chaque matin, comme n’importe quelle appli.",
		"install.go": "Ajouter à l’écran d’accueil",
		"install.later": "Plus tard",
		"install.ios.intro": "Deux gestes et c’est fait :",
		"install.ios.share": "Touche le bouton Partager",
		"install.ios.add": "Choisis « Sur l’écran d’accueil »",
		"install.ok": "Compris",
		"install.link": "Installer l’app",
		"install.manual": "Ouvre le menu de ton navigateur (⋮ ou ⋯) et choisis « Installer l’application » ou « Ajouter à l’écran d’accueil ».",
		"wiz.back": "Retour",
		"settings.reset": "Réinitialiser l’app",
		"settings.refresh": "Actualiser la météo",
		"settings.refresh.busy": "Actualisation…",
		"settings.refresh.done": "Météo à jour",
		"settings.refresh.failed": "Échec de l’actualisation. Vérifie la connexion.",
		"settings.reset.confirm": "Cela efface tes réglages, ton lieu et tes avis sur cet appareil, puis relance la configuration.",
		"settings.reset.yes": "Oui, réinitialiser",
		"settings.reset.cancel": "Annuler",
		"day.plan": "Voyage",
		"brand.home": "Layers Weather, retour à aujourd’hui",
		"day.learn": "Apprendre",
		"learn.title": "Comment s’habiller par tous les temps",
		"learn.sub": "Les règles simples derrière Layers Weather.",
		"learn.checks.title": "On vérifie quatre choses",
		"learn.check.feels": "Le froid ressenti",
		"learn.check.rain": "Pluie ou neige",
		"learn.check.wind": "Vent",
		"learn.check.sun": "Force du soleil",
		"learn.checks.then": "…pour le matin, l’après-midi et le soir. Puis on choisit tes vêtements.",
		"learn.ladder.title": "L’échelle des couches",
		"learn.ladder.sub": "Plus il fait froid, plus on met de couches.",
		"learn.range.above": "{t} et plus",
		"learn.range.between": "de {from} à {to}",
		"learn.range.below": "sous {t}",
		"learn.rung.hot": "Temps à t-shirt",
		"learn.rung.warm": "Tenue légère",
		"learn.rung.mild": "Une couche légère en plus",
		"learn.rung.cool": "Trois couches",
		"learn.rung.cold": "Manteau, bonnet et écharpe",
		"learn.rung.freezing": "Quatre couches et thermique",
		"learn.feels.title": "Le ressenti, pas juste le chiffre",
		"learn.feels.wind": "Le vent donne plus froid.",
		"learn.feels.sun": "Le soleil donne plus chaud.",
		"learn.feels.you": "Souvent froid, ou souvent chaud ? Les réglages décalent l’échelle de {n}.",
		"learn.rain.title": "Pluie et vent",
		"learn.rain.calm": "Pluie, peu de vent",
		"learn.rain.calmText": "Prends un parapluie dès {p} de risque de pluie.",
		"learn.rain.windy": "Pluie et fortes rafales",
		"learn.rain.windyText": "Des rafales dès {s} retournent les parapluies. Mets un imperméable à capuche.",
		"learn.wind.title": "Du vent",
		"learn.wind.text": "Dès {s} de vent, choisis une couche coupe-vent. Les grands chapeaux s’envolent : prends une casquette.",
		"learn.boots.title": "Sol mouillé",
		"learn.boots.text": "Dès {p} de risque de pluie : chaussures imperméables. Neige : bottes de neige.",
		"learn.sun.title": "Soleil fort",
		"learn.sun.text": "Dès UV {uv} : chapeau et crème solaire. Lunettes de soleil quand le soleil brille 2 heures ou plus, dès UV {uv2} pendant 2 heures ou plus, ou au soleil sur la neige.",
		"learn.sun.season": "Hors été, crème solaire seulement dès UV {uv}, une fois avant de partir. En été, elle va dans le sac, pour en remettre.",
		"learn.sun.hatCold": "Chapeau ou casquette seulement à partir de {t} ressentis, et hors été dès UV {uv}. Un seul couvre-chef par jour : si la journée demande un bonnet, on garde le bonnet.",
		"learn.legs.title": "Jambes et pieds",
		"learn.range.atOrBelow": "{t} et moins",
		"learn.legs.snow": "Neige et {t} ou moins",
		"learn.feet.sandals": "{t} et plus, au sec",
		"learn.feet.sneakers": "La plupart des jours",
		"learn.feet.rain": "Pluie {p}+",
		"item.socksShort": "Socquettes",
		"item.socksEveryday": "Chaussettes",
		"item.socksWool": "Chaussettes en laine",
		"item.socksThermal": "Mi-bas thermiques",
		"item.socksEveryday@kids": "Chaussettes",
		"item.socksWool@kids": "Chaussettes chaudes",
		"item.socksThermal@kids": "Chaussettes de neige",
		"shoes.title.light": "Chaussures légères",
		"label.socks": "Chaussettes",
		"feet.socks.none": "Pas de chaussettes aujourd’hui.",
		"feet.socks.short": "Des socquettes gardent les pieds au frais dans les baskets.",
		"feet.socks.wool": "Journée froide : des chaussettes en laine gardent les orteils au chaud.",
		"feet.socks.woolBoots": "Les bottes en caoutchouc ne tiennent pas chaud : chaussettes en laine.",
		"feet.socks.thermal": "Glacial : mi-bas thermiques.",
		"feet.socks.thermalSnow": "Les mi-bas thermiques empêchent la neige d’entrer dans les bottes.",
		"learn.socks.title": "Chaussettes",
		"learn.socks.noneLabel": "Sans chaussettes",
		"learn.socks.none": "Avec des sandales",
		"learn.socks.short": "En baskets, {t} et plus toute la journée",
		"learn.socks.everyday": "La plupart des jours",
		"learn.socks.wool": "{t} et moins, ou bottes de pluie sous {r}",
		"learn.socks.thermal": "{t} et moins, ou jeux dans la neige",
		"learn.socks.note": "Choisies une fois pour la journée, selon son heure la plus froide. Jamais de socquettes dans des bottes. La paire de rechange d’un jour de pluie est du même type.",
		"learn.extras.title": "Pour le froid",
		"learn.extras.rule": "{t} et moins ({w} avec du vent)",
		"learn.smart.title": "Deux bonnes habitudes",
		"learn.smart.once": "On s’habille une fois : s’il pleut plus tard, l’imperméable dès le matin.",
		"learn.smart.bag": "Pas utile maintenant, mais plus tard ? Dans le sac.",
		"bring.title": "À emporter",
		"bring.itemWindow": "{item} pour {window}",
		"bring.itemPart": "{item} {when}",
		"bag.title": "Sac à dos {when}",
		"bag.out": "à sortir",
		"bag.in": "à ranger",
		"bag.stay": "dans le sac",
		"bag.more": "+{n} de plus",
		"bag.less": "Voir moins",
		"bag.badge.pack": "{n} à mettre dans le sac",
		"bag.badge.out": "{n} à sortir du sac",
		"bag.badge.in": "{n} à ranger dans le sac",
		"bag.sayOut": "À sortir : {items}",
		"bag.sayIn": "À ranger : {items}",
		"bag.sayStay": "Reste dans le sac : {items}",
		"kids.fromBag": "Sortir du sac et mettre",
		"kids.intoBag": "Enlever et ranger dans le sac",
		"kids.stillInBag": "Encore dans ton sac",
		"kids.sayStillInBag": "Encore dans ton sac : {items}.",
		"kids.sayFromBag": "Sortir du sac et mettre : {items}.",
		"kids.sayIntoBag": "Enlever et ranger dans le sac : {items}.",
		"kids.bag": "À ranger dans ton sac",
		"kids.sayBag": "À ranger dans ton sac : {items}.",
		"speech.bring": "À emporter : {items}.",
		"noun.days.one": "jour",
		"noun.days.other": "jours",
		"noun.pieces.one": "pièce",
		"noun.pieces.other": "pièces",
		"trip.title": "Préparer un voyage",
		"trip.where": "Où vas-tu ?",
		"trip.pack": "Préparer ma valise",
		"trip.change": "Modifier le voyage",
		"trip.clear": "Effacer le voyage",
		"trip.loading": "On regarde la météo là-bas…",
		"trip.error": "Impossible d’obtenir la météo pour ce voyage. Réessaie.",
		"trip.datesError": "Vérifie les dates : 30 jours maximum, à partir d’aujourd’hui.",
		"trip.headline": "{n|days} à {place}",
		"trip.count": "Environ {n|pieces} à emporter",
		"trip.feels": "Ressenti de {from} à {to}.",
		"trip.chip.rain": "Jours de pluie : {n}",
		"trip.chip.sun": "Jours de soleil : {n}",
		"trip.chip.wind": "Jours de vent : {n}",
		"trip.chip.snow": "Jours de neige : {n}",
		"trip.source.forecast": "D’après les prévisions.",
		"trip.source.typical": "Trop loin pour une prévision : on utilise la météo des mêmes dates ces dix dernières années.",
		"trip.source.mixed": "Prévisions jusqu’au {date}. Ensuite, la météo habituelle : les mêmes dates ces dix dernières années (les jours au bord en pointillés).",
		"trip.typicalDay": "météo habituelle",
		"trip.basics": "Plus sous-vêtements pour {n|days}.",
		"trip.laundry": "Plus d’une semaine : on compte une lessive.",
		"trip.packed": "{done} sur {total} dans la valise",
		"trip.packedLabel": "Dans la valise",
		"trip.allPacked": "Valise prête !",
		"settings.kids": "Enfants",
		"settings.clear.ticks": "Vider la liste",
		"settings.clear.best": "Effacer le record",
		"settings.clear.stickers": "Vider l’album d’autocollants",
		"settings.clear.ticks.confirm": "Décocher la liste des enfants et remettre le chrono à zéro ?",
		"settings.clear.best.confirm": "Oublier le meilleur temps de préparation sur cet appareil ?",
		"settings.clear.stickers.confirm": "Retirer tous les autocollants de l’album ? C’est définitif.",
		"settings.clear.yes": "Oui, effacer",
		"settings.cleared": "Effacé",
		"trip.untickAll": "Tout décocher",
		"trip.undoUntick": "Annuler : tout recocher",
		"trip.unticked": "Tout est décoché",
		"timer.start": "Lancer le chrono",
		"timer.pause": "Mettre en pause",
		"timer.resume": "Continuer",
		"timer.again": "Recommencer",
		"timer.hold": "Garde le doigt sur le chrono pour tout recommencer",
		"timer.go": "Partez !",
		"timer.started": "Chrono lancé. Partez !",
		"timer.paused": "Chrono en pause",
		"timer.resumed": "Chrono relancé",
		"timer.cleared": "Tout est effacé. Recommence quand tu es prêt.",
		"timer.readyIn": "Prêt en {time}",
		"timer.newBest": "Nouveau record !",
		"timer.yourBest": "Ton record : {time}",
		"timer.dur.s": "{s|seconds}",
		"timer.dur.m": "{m|minutes}",
		"timer.dur.ms": "{m|minutes} {s|seconds}",
		"noun.minutes.one": "minute",
		"noun.minutes.other": "minutes",
		"noun.seconds.one": "seconde",
		"noun.seconds.other": "secondes",
		"item.hikingBoots": "Chaussures de randonnée",
		"item.swimwear": "Short de bain",
		"item.swimsuit": "Maillot de bain",
		"item.flipflops": "Tongs",
		"item.goggles": "Masque de ski",
		"item.smartOutfit": "Chemise",
		"item.dress": "Robe",
		"item.smartShoes": "Chaussures habillées",
		"item.sportswear": "Tenue de sport",
		"item.runningShoes": "Chaussures de course",
		"item.dayBag": "Petit sac à dos",
		"item.towel": "Serviette de plage",
		"item.skiJacket": "Veste de ski",
		"item.skiPants": "Pantalon de ski",
		"item.fleece": "Polaire",
		"item.headTorch": "Lampe frontale",
		"item.cyclingShorts": "Cuissard de vélo",
		"item.bikeLight": "Éclairage de vélo",
		"item.helmet": "Casque",
		"act.hike": "Randonnée",
		"act.beach": "Plage & baignade",
		"act.snow": "Neige & ski",
		"act.out": "Sorties",
		"act.sport": "Sport & course",
		"act.city": "Balades en ville",
		"act.work": "Travail",
		"act.camp": "Camping",
		"act.cycle": "Vélo",
		"act.level.1": "Une fois",
		"act.level.2": "Quelques jours",
		"act.level.3": "Presque tous les jours",
		"trip.what": "Qu’allez-vous faire ?",
		"trip.optional": "Facultatif",
		"trip.what.hint": "Touchez une activité pour l’ajouter, encore pour plus de jours, et une fois de plus pour l’enlever.",
		"trip.for": "pour : {what}",
		"trip.group.active": "Tenues d’activité",
		"trip.group.gear": "Équipement",
		"kids.stickers.title": "Mes autocollants",
		"kids.stickers.got": "Tu as gagné un autocollant !",
		"kids.stickers.count": "Autocollants : {n}",
		"kids.stickers.empty": "Prépare-toi le matin, et la météo du jour devient ton premier autocollant !",
		"kids.sticker.sun": "Soleil",
		"kids.sticker.partly": "Soleil et nuages",
		"kids.sticker.cloud": "Nuageux",
		"kids.sticker.rain": "Pluie",
		"kids.sticker.snow": "Neige",
		"kids.sticker.storm": "Orage",
		"kids.sticker.fog": "Brouillard",
		"kids.sticker.rainbow": "Arc-en-ciel",
		"kids.sticker.frost": "Première gelée !",
		"kids.sticker.shorts": "Le short est de retour !",
		"cmp.warmer": "{deg} de plus qu’hier.",
		"cmp.warmer.today": "{deg} de plus qu’aujourd’hui.",
		"cmp.warmer.item": "{deg} de plus qu’hier : {item} peut rester à la maison.",
		"cmp.warmer.item.today": "{deg} de plus qu’aujourd’hui : {item} peut rester à la maison.",
		"cmp.colder": "{deg} de moins qu’hier.",
		"cmp.colder.today": "{deg} de moins qu’aujourd’hui.",
		"cmp.colder.item": "{deg} de moins qu’hier : ajoute {item}.",
		"cmp.colder.item.today": "{deg} de moins qu’aujourd’hui : ajoute {item}.",
		"cmp.rain": "De la pluie aujourd’hui, pas hier : une couche imperméable par-dessus.",
		"cmp.rain.today": "De la pluie demain, pas aujourd’hui : une couche imperméable par-dessus.",
		"cmp.rain.umbrella": "De la pluie aujourd’hui, pas hier : le parapluie retourne dans le sac.",
		"cmp.rain.umbrella.today": "De la pluie demain, pas aujourd’hui : le parapluie retourne dans le sac.",
		"cmp.dry": "Au sec aujourd’hui après la pluie d’hier : pas besoin de parapluie.",
		"cmp.dry.today": "Au sec demain après la pluie d’aujourd’hui : pas besoin de parapluie.",
		"cmp.firstShorts": "Le short est de retour ! Le premier jour de short depuis plus d’un mois.",
		"cmp.firstFrost": "Première gelée depuis plus d’un mois : couvre-toi bien.",
		"cmp.firstCoat": "Le temps du manteau est revenu : le premier depuis plus d’un mois.",
		"cmp.firstSunscreen": "Le soleil fort est de retour : de la crème solaire pour la première fois depuis plus d’un mois.",
		"cmp.kids.warmer": "Plus chaud qu’hier !",
		"cmp.kids.warmer.today": "Plus chaud demain !",
		"cmp.kids.colder": "Plus froid qu’hier !",
		"cmp.kids.colder.today": "Plus froid demain !",
		"cmp.kids.rain": "De la pluie aujourd’hui !",
		"cmp.kids.rain.today": "De la pluie demain !",
		"cmp.kids.dry": "Pas de pluie aujourd’hui !",
		"cmp.kids.dry.today": "Pas de pluie demain !",
		"cmp.kids.firstShorts": "Le short est de retour !",
		"cmp.kids.firstFrost": "Première gelée !",
		"cmp.kids.firstCoat": "C’est l’heure du manteau !",
		"cmp.kids.firstSunscreen": "C’est l’heure de la crème solaire !",
		"ptr.pull": "Tirer pour actualiser",
		"ptr.release": "Relâcher pour actualiser",
		"trip.packedCount": "{done} sur {total}",
		"trip.days": "Ton voyage",
		"trip.group.tops": "Hauts",
		"trip.group.warm": "Couches chaudes",
		"trip.group.legs": "Jambes",
		"trip.group.shoes": "Pieds",
		"trip.group.head": "Tête",
		"trip.group.extras": "Accessoires",
		"trip.item.packed": "{item} ×{qty}, dans la valise",
		"trip.item.todo": "{item} ×{qty}, pas encore dans la valise",
		"item.top": "Haut",
		"item.hoodie": "Sweat à capuche",
		"item.skirt": "Jupe",
		"settings.style": "Style de vêtements",
		"settings.style.girl": "Fille",
		"settings.style.boy": "Garçon",
		"hl.tshirt@girl": "Temps à haut léger.",
		"hl.tshirt.when@girl": "Temps à haut léger {when}.",
		"hl.sun@boy": "Casquette et crème solaire.",
		"hl.sunhat@boy": "Casquette sur la tête.",
		"head.title.sunhat@boy": "Casquette {when}",
		"legs.title.shorts@girl": "Temps à jupe",
		"legs.detail.shortsLater@girl": "Assez chaud pour une jupe {when}.",
		"item.cardigan": "Gilet",
		"item.tights": "Collants",
		"legs.title.thermals@girl": "Pantalon + collants",
		"legs.detail.thermals@girl": "Des collants chauds sous le pantalon.",
		"label.hoodUp": "Capuche",
		"note.swapped": "à la place",
		"note.tooWindy": "trop de vent",
		"state.on": "utile",
		"state.off": "inutile",
		"card.layers": "Couches",
		"card.shoes": "Pieds",
		"card.head": "Tête",
		"card.rain": "Pluie",
		"card.extras": "Accessoires",
		"hl.bundle": "Couvre-toi bien.",
		"hl.bundle.when": "Couvre-toi bien {when}.",
		"hl.wrap": "Habille-toi chaudement.",
		"hl.wrap.when": "Habille-toi chaudement {when}.",
		"hl.layer": "Une couche légère par-dessus.",
		"hl.layer.when": "Une couche légère par-dessus {when}.",
		"hl.tshirt": "Temps à t-shirt.",
		"hl.tshirt.when": "Temps à t-shirt {when}.",
		"hl.light": "Tenue légère.",
		"hl.light.when": "Tenue légère {when}.",
		"hl.rainjacket": "Imperméable plutôt que parapluie.",
		"hl.umbrella": "Prends un parapluie.",
		"hl.snow": "Bottes de neige aux pieds.",
		"hl.sun": "Chapeau et crème solaire.",
		"hl.windy": "Du vent : un haut coupe-vent.",
		"hl.dry": "Pas de pluie prévue.",
		"hl.sun.cap": "Casquette et crème solaire.",
		"hl.sunhat": "Chapeau sur la tête.",
		"hl.cap": "Casquette sur la tête.",
		"hl.sunscreen": "Crème solaire.",
		"hl.sunglasses": "Lunettes de soleil.",
		"sum.change": "{from} d'abord, {to} ensuite.",
		"sum.same": "{word} toute la journée.",
		"sum.rain": "Pluie {window}.",
		"sum.snow": "De la neige en vue.",
		"sum.dry": "Temps sec.",
		"sum.gusts": "Rafales jusqu'à {speed}.",
		"chip.feels": "Ressenti {value}",
		"chip.feelsRange": "Ressenti {from} → {to}",
		"chip.rain": "Pluie {window}",
		"chip.snow": "Neige",
		"chip.dry": "Sec",
		"chip.windy": "Du vent {when}",
		"layers.title.same": "{n|layers} toute la journée",
		"layers.title.change": "{a|layers}, puis {b}",
		"layers.detail.off": "{item} en moins {when}.",
		"layers.detail.offBack": "{item} en moins {off}, à remettre {back}.",
		"layers.detail.on": "{item} en plus {when}.",
		"layers.detail.rainOuter": "Aujourd'hui, l'imperméable en couche extérieure.",
		"layers.detail.wind": "Choisis une couche extérieure coupe-vent.",
		"layers.detail.steady": "Pas besoin de se changer.",
		"shoes.title.sandals": "Temps à sandales",
		"shoes.title.sneakers": "Chaussures de tous les jours",
		"shoes.title.rainboots": "Chaussures imperméables",
		"shoes.title.snowboots": "Bottes de neige",
		"shoes.detail.sandals": "Chaud et sec. Laisse respirer tes pieds.",
		"shoes.detail.sneakers": "Sol sec. Tout ce qui est confortable ira.",
		"shoes.detail.rainboots": "Flaques {window}. Garde tes chaussettes au sec.",
		"shoes.detail.snowboots": "Neige au sol. Des bottes chaudes qui accrochent.",
		"head.title.none": "Pas besoin de chapeau",
		"head.title.beanie": "Bonnet {when}",
		"head.title.sunhat": "Chapeau {when}",
		"head.title.cap": "Casquette {when}",
		"head.detail.cold": "Pour garder les oreilles au chaud.",
		"head.detail.coldWind": "Vent froid : couvre tes oreilles.",
		"head.detail.sun": "Soleil fort : protège ton visage et ta nuque.",
		"head.detail.windySun": "Soleil et rafales : une casquette tient mieux qu'un grand chapeau.",
		"head.detail.hood": "Ta capuche te protège de la pluie.",
		"head.detail.hoodLater": "Quand il pleut, mets ta capuche.",
		"head.detail.none": "Doux et pas trop ensoleillé.",
		"rain.title.none": "Pas de pluie prévue",
		"rain.detail.none": "Le parapluie reste à la maison.",
		"rain.title.umbrella": "Prends un parapluie",
		"rain.detail.window": "Pluie {window}.",
		"rain.detail.windyLater": "Trop de vent {when} : capuche.",
		"rain.title.skipUmbrella": "Oublie le parapluie",
		"rain.detail.windy": "Des rafales jusqu'à {speed} vont le retourner. Mets ta capuche.",
		"rain.title.snow": "De la neige en vue",
		"rain.detail.snow": "Capuche et fermeture jusqu'en haut.",
		"extras.title.none": "Rien de plus",
		"extras.detail.cold": "Pour les moments froids.",
		"extras.detail.coldWind": "Le vent rend l'air plus froid.",
		"extras.detail.sun": "UV jusqu'à {value}. Protège ta peau et tes yeux.",
		"extras.detail.none": "Pas besoin de protection solaire.",
		"numbers.title": "Données météo",
		"numbers.summary": "{from} → {to} · pluie {prob} · rafales {speed}",
		"numbers.temp": "Température",
		"numbers.feels": "Ressenti",
		"numbers.rain": "Pluie",
		"numbers.wind": "Vent",
		"numbers.uv": "Indice UV",
		"numbers.daylight": "Jour",
		"numbers.sub.range": "min → max",
		"numbers.sub.rain": "{amount} au total",
		"numbers.sub.gusts": "rafales jusqu'à {speed}",
		"numbers.sub.daylight": "lever – coucher du soleil",
		"uv.low": "faible",
		"uv.moderate": "modéré",
		"uv.high": "élevé",
		"uv.veryHigh": "très élevé",
		"uv.extreme": "extrême",
		"kids.put": "À mettre",
		"kids.notToday": "Pas aujourd'hui",
		"kids.takeOff": "À enlever",
		"kids.tooWindy": "Trop de vent",
		"kids.ready": "Prêt à partir !",
		"kids.readyTomorrow": "Tout est prêt pour demain !",
		"kids.mute": "Couper la voix",
		"kids.progress": "{done} sur {total}",
		"kids.getReady": "On se prépare",
		"kids.say": "Mets {items}.",
		"kids.sayUmbrella": "Prends ton parapluie.",
		"kids.sayNoUmbrella": "Pas de parapluie aujourd'hui, il y a trop de vent !",
		"kids.sayTakeOff": "Enlève {items}.",
		"kids.itemOn": "{item}, mis",
		"kids.itemNotYet": "{item}, pas encore mis",
		"kids.itemPacked": "{item}, dans le sac",
		"kids.itemNotPacked": "{item}, pas encore dans le sac",
		"speech.wear": "Mets {items}.",
		"settings.open": "Réglages",
		"settings.title": "Réglages",
		"settings.language": "Langue",
		"settings.units": "Unités",
		"settings.feel": "D'habitude, j'ai…",
		"settings.feel.cold": "Froid",
		"settings.feel.normal": "Ni chaud ni froid",
		"settings.feel.hot": "Chaud",
		"settings.done": "OK",
		"settings.credit": "Données météo : Open-Meteo.com (CC BY 4.0)",
		"loc.open": "Changer de lieu",
		"loc.title": "Où es-tu ?",
		"loc.useMine": "Utiliser ma position",
		"loc.myLocation": "Ma position",
		"loc.here": "Ici",
		"loc.search": "Chercher une ville",
		"loc.searching": "Recherche…",
		"loc.noResults": "Aucun lieu trouvé",
		"loc.denied": "La localisation est désactivée. Cherche ta ville.",
		"loc.close": "Fermer",
		"status.loading": "On regarde le ciel…",
		"status.waitingNet": "En attente de connexion…",
		"status.error": "Impossible de charger la météo. Vérifie ta connexion.",
		"status.retry": "Réessayer",
		"status.saved": "Dernières prévisions enregistrées.",
		"warn.heading": "Vigilances météo officielles",
		"warn.level.2": "Vigilance jaune",
		"warn.level.3": "Vigilance orange",
		"warn.level.4": "Vigilance rouge",
		"warn.type.0": "Météo",
		"warn.type.1": "Vent",
		"warn.type.2": "Neige et verglas",
		"warn.type.3": "Orages",
		"warn.type.4": "Brouillard",
		"warn.type.5": "Canicule",
		"warn.type.6": "Grand froid",
		"warn.type.7": "Littoral",
		"warn.type.8": "Feux de forêt",
		"warn.type.9": "Avalanches",
		"warn.type.10": "Pluie",
		"warn.type.12": "Inondations",
		"warn.type.13": "Pluie-inondation",
		"warn.type.15": "Sécheresse",
		"warn.until": "Jusqu’à {time}",
		"warn.more": "Détails",
		"warn.issued": "Émise par {sender}, {time}",
		"warn.source.meteoalarm": "Plus sur meteoalarm.org",
		"warn.source.nws": "Plus sur weather.gov",
		"warn.kids": "Demande à un adulte quoi faire.",
		"warn.credit": "Vigilances météo : EUMETNET – MeteoAlarm et les services météorologiques nationaux ; aux États-Unis, le National Weather Service. Limites des régions © EuroGeographics.",
		"a11y.skip": "Aller au contenu",
		"status.dayOver": "La journée est presque finie, voici demain."
	},
	es: {
		"app.tagline": "Vístete para el tiempo, no para los números.",
		"mode.label": "Modo",
		"mode.everyone": "Mayores (12+)",
		"mode.kids": "Niños (3–12)",
		"day.today": "Hoy",
		"day.tomorrow": "Mañana",
		readAloud: "Léemelo",
		"readAloud.stop": "Parar la lectura",
		"item.socks": "Calcetines de repuesto",
		"item.poncho": "Poncho de lluvia",
		"item.lipbalm": "Bálsamo labial",
		"item.handwarmers": "Calentadores de manos",
		"item.fan": "Abanico",
		"item.repellent": "Repelente",
		"item.mask": "Mascarilla",
		"item.tissues": "Pañuelos",
		"extras.detail.socks": "Día mojado: un par de {item} de repuesto en la mochila.",
		"extras.detail.poncho": "Demasiado viento para el paraguas: un poncho te mantiene seco.",
		"extras.detail.lipbalm": "Viento frío o nieve al sol: los labios se secan rápido.",
		"extras.detail.handwarmers": "Helado: calentadores para los bolsillos.",
		"extras.detail.fan": "Mucho calor: un abanico ayuda.",
		"extras.detail.repellent": "Calor, humedad y sin viento: salen los mosquitos.",
		"extras.detail.mask": "Humo o polvo en el aire: una mascarilla ayuda.",
		"extras.detail.tissues": "Mucho polen: pañuelos y tu medicina para la alergia.",
		"settings.allergies": "Alergias o asma",
		"settings.yes": "Sí",
		"settings.no": "No",
		"settings.allergies.hint": "Pañuelos los días de mucho polen, y mascarilla antes cuando el aire es malo.",
		"settings.eyes": "Color de ojos",
		"settings.eyes.hint": "Los ojos claros notan antes el deslumbramiento, así que las gafas de sol llegan antes.",
		"settings.eyes.brown": "Marrón",
		"settings.eyes.hazel": "Avellana",
		"settings.eyes.green": "Verde",
		"settings.eyes.blue": "Azul",
		"learn.sense.socks": "Lluvia fuerte: calcetines de repuesto (antes para niños, que chapotean).",
		"learn.sense.poncho": "Niños, lluvia con demasiado viento para el paraguas: un poncho en vez del chubasquero.",
		"learn.sense.lipbalm": "Rachas heladas o nieve al sol: bálsamo labial.",
		"learn.sense.handwarmers": "Desde {t} o menos: calentadores de manos.",
		"learn.sense.fan": "Desde {t} durante un par de horas: un abanico.",
		"learn.sense.repellent": "Tardes cálidas, húmedas y sin viento: repelente.",
		"learn.sense.mask": "Humo o polvo en el aire: una mascarilla.",
		"learn.sense.tissues": "Mucho polen, con alergias activadas en Ajustes: pañuelos y medicina.",
		"note.apply": "ponte",
		"note.reapply": "repite",
		"note.applyOnce": "una vez",
		"note.applied": "ya puesto",
		"bag.now": "ahora",
		"extras.detail.sunOnce": "Fuera del verano basta una vez antes de salir: no hace falta llevarlo.",
		"extras.detail.sunLater": "Sol fuerte más tarde: ponte protector una vez, antes de salir.",
		"extras.detail.sunCarry": "Llévalo contigo y vuelve a ponértelo más tarde.",
		"item.water": "Botella de agua",
		"item.reflector": "Reflectante",
		"hl.storm": "Tormentas: capucha puesta, sin paraguas.",
		"hl.icy": "Resbala: botas con buen agarre.",
		"chip.storm": "Tormenta",
		"chip.icy": "Hielo",
		"note.storm": "rayos",
		"rain.title.storm": "Tormenta: sin paraguas",
		"rain.detail.storm": "Capucha puesta y quédate dentro si puedes.",
		"shoes.detail.icy": "Puede haber hielo. Botas con buen agarre.",
		"shoes.detail.warmRain": "Lluvia cálida: las sandalias se secan rápido.",
		"label.waterproofCoat": "Abrigo impermeable",
		"extras.detail.water": "Hace calor: bebe mucho.",
		"extras.detail.reflector": "Oscuro o con niebla: que te vean bien.",
		"kids.storm": "¡Truenos! Capucha",
		"kids.sayStorm": "Hoy hay tormenta: sin paraguas, ¡capucha puesta!",
		"learn.sense.title": "Sentido común",
		"learn.sense.storm": "Tormenta: sin paraguas, capucha.",
		"learn.sense.ice": "Hielo: botas con agarre.",
		"learn.sense.glare": "Sol sobre nieve: gafas de sol.",
		"learn.sense.water": "Desde {t} durante un par de horas: una botella de agua.",
		"learn.sense.warmRain": "Lluvia cálida: sandalias, sin problema.",
		"learn.sense.reflector": "Niños fuera a oscuras antes de las 18:00, o con niebla: un reflectante.",
		"settings.style.women": "Mujer",
		"settings.style.men": "Hombre",
		"settings.howItWorks": "Cómo funciona",
		"settings.appearance": "Apariencia",
		"settings.appearance.auto": "Automática",
		"settings.appearance.light": "Clara",
		"settings.appearance.dark": "Oscura",
		"card.title.bagged": "{items} en la mochila",
		"privacy.title": "Privacidad",
		"privacy.lead": "Sin cuentas, sin anuncios, sin rastreo y sin cookies. Lo que configuras se queda en tu dispositivo.",
		"privacy.device.title": "Lo que se queda en tu dispositivo",
		"privacy.device.body": "Tus ajustes, lugares, viajes y marcas, tus respuestas de la tarde, y la lista, el mejor tiempo y las pegatinas de los niños se guardan solo en este navegador. Nadie más puede verlos. «Restablecer la app» en Ajustes lo borra todo.",
		"privacy.weather.title": "Lo que se envía para obtener el tiempo",
		"privacy.weather.body": "Para obtener el pronóstico, la calidad del aire y el tiempo de los últimos días, la app envía la posición del lugar a Open-Meteo (open-meteo.com). El tiempo de años anteriores para los viajes llega a través de nuestro propio servidor, que consulta a Open-Meteo una vez por lugar y guarda una copia para próximos viajes allí. Cuando buscas un lugar, también se envían las palabras que escribes y el idioma de la app. Para lugares en EE. UU., la posición también va al Servicio Meteorológico Nacional (weather.gov) para sus avisos. Los avisos de Europa llegan de MeteoAlarm a través de nuestro propio servidor, que solo pide los avisos de tu país, nunca tu posición.",
		"privacy.location.title": "Tu ubicación",
		"privacy.location.body": "La app pide la posición a tu dispositivo solo cuando tocas «Usar mi ubicación». Solo se guardan los alrededores (a 1 km aproximadamente), nunca el punto exacto: se guardan en tu dispositivo y se envían, como cualquier lugar, para obtener su tiempo. Siempre puedes elegir un lugar por su nombre.",
		"privacy.server.title": "Nuestro servidor",
		"privacy.server.body": "La app llega desde nuestro propio servidor, a través de Cloudflare. Como en cualquier web, ven tu dirección IP y qué archivos se cargan. Solo se usa para ofrecer la app y mantenerla segura, nunca para crear un perfil tuyo.",
		"privacy.links.title": "Enlaces compartidos",
		"privacy.links.body": "Un enlace compartido solo lleva lo necesario para abrir la misma página: el lugar, las fechas y si es la vista de niños. Nunca tus otros ajustes ni nada sobre ti.",
		"privacy.voice.title": "Lectura en voz alta",
		"privacy.voice.body": "La lectura usa las voces de tu dispositivo. Algunos navegadores usan en su lugar voces en línea de su fabricante (las de Google en Chrome, por ejemplo), que reciben el texto leído.",
		"privacy.kids.title": "Niños",
		"privacy.kids.body": "El modo niños no recoge nada sobre el niño. La lista, el cronómetro y las pegatinas se quedan en el dispositivo.",
		"privacy.feedback.title": "Tus respuestas de la tarde",
		"privacy.feedback.body": "Tus respuestas a «¿Te sirvieron los consejos de hoy?» se quedan en tu dispositivo. Si eso cambia algún día, este aviso lo dirá antes.",
		"privacy.updated": "Última actualización: 30 de septiembre de 2026",
		"readAloud.short": "Escuchar",
		"evening.tomorrow": "Ya es de noche, así que te mostramos mañana.",
		"evening.today": "Lo que queda de hoy",
		"feedback.face.cold": "Demasiado frío",
		"feedback.face.good": "Perfecto",
		"feedback.face.hot": "Demasiado calor",
		"trip.when": "¿Cuándo?",
		"trip.recent": "Viajes recientes",
		"page.today": "Layers Weather - ¿Qué me pongo y qué llevo hoy?",
		"page.tomorrow": "Layers Weather - ¿Qué me pongo y qué llevo mañana?",
		"page.plan": "Layers Weather - ¿Qué meto en la maleta para mi viaje?",
		"page.learn": "Layers Weather - ¿Cómo funciona?",
		"trip.popular": "Populares",
		"trip.confidence": "Fiabilidad {pct}",
		"trip.confidence.hint": "Cuánto fiarse del tiempo con tanta antelación: mucho para los próximos días, menos pasada una semana, y más allá de 16 días solo una orientación de años anteriores.",
		"trip.pickStart": "Toca el primer día",
		"trip.pickEnd": "Ahora toca el último día",
		"trip.span": "{n|days}",
		"trip.prevMonth": "Mes anterior",
		"trip.nextMonth": "Mes siguiente",
		"trip.copied": "Copiado",
		"share.copyLink": "Copiar enlace",
		"link.viewing": "Viendo {place}",
		"link.keep": "Quedármelo",
		"link.back": "Volver a {place}",
		"link.setup": "Configurar para mí",
		"link.sharedPlace": "Lugar compartido",
		"link.kidsView": "Vista infantil",
		"link.grownUps": "Vista adultos",
		"wiz.where.use": "Usar {place}",
		"trip.act.edit": "Editar",
		"trip.act.share": "Compartir",
		"trip.act.clear": "Borrar",
		"gate.title": "Solo para mayores",
		"gate.ask": "¿Cuánto es {a} por {b}?",
		"gate.wrong": "Casi. Inténtalo otra vez.",
		"gate.delete": "Borrar",
		"face.cold": "Brrr, frío",
		"face.good": "Agradable",
		"face.hot": "Calor",
		"kids.sayWeather": "El tiempo {when}: {word}.",
		"kids.onSay": "¡{item}, listo!",
		"kids.packedSay": "¡{item}, a la mochila!",
		"kids.tapToHear": "Toca para escucharlo",
		"learn.kids.rain": "¿Lluvia? Llévate el paraguas.",
		"learn.kids.windyRain": "¿Lluvia y viento fuerte? Capucha puesta, sin paraguas.",
		"learn.kids.wind": "¿Viento? Cierra bien la chaqueta.",
		"learn.kids.boots": "¿Charcos? ¡Botas de agua! ¿Nieve? ¡Botas de nieve!",
		"learn.kids.sun": "¿Mucho sol? Gorro, crema solar y gafas de sol.",
		"gate.n3": "tres",
		"gate.n4": "cuatro",
		"gate.n5": "cinco",
		"gate.n6": "seis",
		"gate.n7": "siete",
		"gate.n8": "ocho",
		"gate.n9": "nueve",
		"strip.label": "Tu día",
		"strip.feels": "sensación {value}",
		"noun.layers.one": "capa",
		"noun.layers.other": "capas",
		"part.morning": "Mañana",
		"part.afternoon": "Tarde",
		"part.evening": "Noche",
		"when.all": "todo el día",
		"when.morning": "por la mañana",
		"when.afternoon": "por la tarde",
		"when.evening": "por la noche",
		"short.morning": "mañana",
		"short.afternoon": "tarde",
		"short.evening": "noche",
		"word.freezing": "helado",
		"word.cold": "frío",
		"word.chilly": "fresquito",
		"word.cool": "fresco",
		"word.mild": "templado",
		"word.warm": "cálido",
		"word.hot": "caluroso",
		"item.tshirt": "Camiseta",
		"item.longsleeve": "Manga larga",
		"item.sweater": "Jersey",
		"item.jacket": "Chaqueta",
		"item.rainjacket": "Chubasquero",
		"item.coat": "Abrigo",
		"item.sandals": "Sandalias",
		"item.sneakers": "Zapatillas",
		"item.rainboots": "Botas de agua",
		"item.snowboots": "Botas de nieve",
		"item.sunhat": "Sombrero",
		"item.cap": "Gorra",
		"item.beanie": "Gorro",
		"item.umbrella": "Paraguas",
		"item.sunglasses": "Gafas de sol",
		"item.sunscreen": "Protector solar",
		"item.scarf": "Bufanda",
		"item.gloves": "Guantes",
		"item.shorts": "Pantalón corto",
		"item.trousers": "Pantalón",
		"item.thermals": "Leggings térmicos",
		"item.snowpants": "Pantalón de nieve",
		"card.legs": "Piernas",
		"legs.title.shorts": "Día de pantalón corto",
		"legs.title.trousers": "Pantalón largo",
		"legs.title.warmTrousers": "Pantalón abrigado",
		"legs.title.thermals": "Pantalón + leggings térmicos",
		"legs.title.snowpants": "Pantalón de nieve",
		"legs.detail.shorts": "Hace calor para ir con las piernas al aire.",
		"legs.detail.trousers": "Basta con un pantalón ligero.",
		"legs.detail.warmTrousers": "Vaqueros o algo más grueso.",
		"legs.detail.thermals": "Leggings o térmicos debajo del pantalón.",
		"legs.detail.snowpants": "El pantalón de nieve encima te mantiene seco y calentito.",
		"legs.detail.shortsLater": "{when} hace calor para pantalón corto.",
		"strip.past": "pasado",
		"strip.pick": "Ver qué ponerte en esta parte del día",
		"view.heading": "Qué ponerte {when}",
		"summary.open": "Más detalles del día",
		"summary.close": "Ocultar detalles",
		"layers.detail.partWord": "{word} {when}.",
		"note.takeOff": "quitar",
		"note.putOn": "poner",
		"feedback.title": "¿Te sirvieron los consejos de hoy?",
		"feedback.kids.title": "¿Estuviste a gusto hoy?",
		"feedback.thanks": "¡Gracias! Nos ayuda a mejorar.",
		"feedback.close": "Cerrar",
		"feedback.face.meh": "No del todo",
		"feedback.why": "¿Pasaste frío o calor con lo que te sugerimos?",
		"feedback.kids.why": "¿Tuviste frío o calor?",
		"feedback.other": "Otra cosa",
		"feedback.warmer": "Entendido. A partir de ahora te abrigaremos un poco más.",
		"feedback.lighter": "Entendido. A partir de ahora te vestiremos un poco más ligero.",
		"feedback.atWarmest": "¡Gracias! Los consejos ya son lo más abrigados posible.",
		"feedback.atLightest": "¡Gracias! Los consejos ya son lo más ligeros posible.",
		"feedback.undo": "Deshacer",
		"feedback.undone": "Deshecho. Los consejos siguen como estaban.",
		"wiz.hello": "¡Hola! Vamos a preparar Layers Weather",
		"wiz.step": "Paso {n} de {total}",
		"wiz.who.title": "¿Quién se va a vestir?",
		"wiz.who.adult": "Yo",
		"wiz.who.adult.sub": "12 años o más · primero las palabras, luego la ropa",
		"wiz.who.kid": "Mi hijo o hija",
		"wiz.who.kid.sub": "De 3 a 12 años · solo la ropa, como lista",
		"wiz.style.title": "¿Qué ropa mostramos?",
		"wiz.feel.title": "¿Cómo te sientes normalmente al aire libre?",
		"wiz.feel.cold": "Tengo frío enseguida",
		"wiz.feel.normal": "Normal",
		"wiz.feel.hot": "Tengo calor enseguida",
		"wiz.where.title": "Por último: ¿dónde estás?",
		"wiz.next": "Siguiente",
		"install.title": "Tenla en tu pantalla de inicio",
		"install.why": "Abre Layers Weather con un toque cada mañana, como cualquier otra app.",
		"install.go": "Añadir a la pantalla de inicio",
		"install.later": "Ahora no",
		"install.ios.intro": "Dos toques y listo:",
		"install.ios.share": "Toca el botón Compartir",
		"install.ios.add": "Elige «Añadir a pantalla de inicio»",
		"install.ok": "Entendido",
		"install.link": "Instalar la app",
		"install.manual": "Abre el menú de tu navegador (⋮ o ⋯) y elige «Instalar aplicación» o «Añadir a pantalla de inicio».",
		"wiz.back": "Atrás",
		"settings.reset": "Restablecer la app",
		"settings.refresh": "Actualizar el tiempo",
		"settings.refresh.busy": "Actualizando…",
		"settings.refresh.done": "Tiempo actualizado",
		"settings.refresh.failed": "No se pudo actualizar. Revisa la conexión.",
		"settings.reset.confirm": "Esto borra tus ajustes, tu lugar y tus opiniones en este dispositivo y vuelve a empezar la configuración.",
		"settings.reset.yes": "Sí, restablecer",
		"settings.reset.cancel": "Cancelar",
		"day.plan": "Viaje",
		"brand.home": "Layers Weather, volver a hoy",
		"day.learn": "Aprende",
		"learn.title": "Cómo vestirse para cualquier tiempo",
		"learn.sub": "Las reglas sencillas detrás de Layers Weather.",
		"learn.checks.title": "Miramos cuatro cosas",
		"learn.check.feels": "Cuánto frío se siente",
		"learn.check.rain": "Lluvia o nieve",
		"learn.check.wind": "Viento",
		"learn.check.sun": "Fuerza del sol",
		"learn.checks.then": "…para la mañana, la tarde y la noche. Luego elegimos tu ropa.",
		"learn.ladder.title": "La escalera de capas",
		"learn.ladder.sub": "Cuanto más frío se siente, más capas.",
		"learn.range.above": "{t} o más",
		"learn.range.between": "de {from} a {to}",
		"learn.range.below": "menos de {t}",
		"learn.rung.hot": "Tiempo de camiseta",
		"learn.rung.warm": "Ropa ligera",
		"learn.rung.mild": "Una capa ligera más",
		"learn.rung.cool": "Tres capas",
		"learn.rung.cold": "Abrigo, gorro y bufanda",
		"learn.rung.freezing": "Cuatro capas y térmicos",
		"learn.feels.title": "La sensación, no solo el número",
		"learn.feels.wind": "El viento hace que se sienta más frío.",
		"learn.feels.sun": "El sol hace que se sienta más cálido.",
		"learn.feels.you": "¿Sueles tener frío o calor? Los ajustes mueven la escalera {n}.",
		"learn.rain.title": "Lluvia y viento",
		"learn.rain.calm": "Lluvia, poco viento",
		"learn.rain.calmText": "Lleva paraguas si la probabilidad de lluvia es {p} o más.",
		"learn.rain.windy": "Lluvia y rachas fuertes",
		"learn.rain.windyText": "Las rachas desde {s} dan la vuelta al paraguas. Ponte un chubasquero con capucha.",
		"learn.wind.title": "Viento",
		"learn.wind.text": "Desde {s} de viento, elige una capa cortavientos. Los sombreros anchos vuelan: mejor gorra.",
		"learn.boots.title": "Suelo mojado",
		"learn.boots.text": "Desde {p} de probabilidad de lluvia: calzado impermeable. Nieve: botas de nieve.",
		"learn.sun.title": "Sol fuerte",
		"learn.sun.text": "Desde UV {uv}: sombrero y protector solar. Gafas de sol cuando el sol brilla 2 horas o más, desde UV {uv2} durante 2 horas o más, o con sol sobre la nieve.",
		"learn.sun.season": "Fuera del verano, protector solo desde UV {uv}, una vez antes de salir. En verano va en la mochila, para repetir.",
		"learn.sun.hatCold": "Sombrero o gorra solo con sensación de {t} o más, y fuera del verano desde UV {uv}. Una sola prenda para la cabeza al día: si el día pide gorro, se queda el gorro.",
		"learn.legs.title": "Piernas y pies",
		"learn.range.atOrBelow": "{t} o menos",
		"learn.legs.snow": "Nieve y {t} o menos",
		"learn.feet.sandals": "{t} o más, seco",
		"learn.feet.sneakers": "Casi todos los días",
		"learn.feet.rain": "Lluvia {p}+",
		"item.socksShort": "Calcetines cortos",
		"item.socksEveryday": "Calcetines",
		"item.socksWool": "Calcetines de lana",
		"item.socksThermal": "Calcetines térmicos altos",
		"item.socksEveryday@kids": "Calcetines",
		"item.socksWool@kids": "Calcetines calentitos",
		"item.socksThermal@kids": "Calcetines de nieve",
		"shoes.title.light": "Calzado ligero",
		"label.socks": "Calcetines",
		"feet.socks.none": "Hoy sin calcetines.",
		"feet.socks.short": "Los calcetines cortos mantienen los pies frescos en las zapatillas.",
		"feet.socks.wool": "Día frío: los calcetines de lana mantienen los dedos calentitos.",
		"feet.socks.woolBoots": "Las botas de goma no abrigan: calcetines de lana.",
		"feet.socks.thermal": "Helada: calcetines térmicos altos.",
		"feet.socks.thermalSnow": "Los calcetines térmicos altos evitan que entre nieve en las botas.",
		"learn.socks.title": "Calcetines",
		"learn.socks.noneLabel": "Sin calcetines",
		"learn.socks.none": "Con sandalias",
		"learn.socks.short": "Con zapatillas, {t} o más todo el día",
		"learn.socks.everyday": "Casi todos los días",
		"learn.socks.wool": "{t} o menos, o botas de agua bajo {r}",
		"learn.socks.thermal": "{t} o menos, o jugar en la nieve",
		"learn.socks.note": "Se eligen una vez para el día, según su hora más fría. Las botas nunca llevan calcetines cortos. El par de repuesto de un día mojado es del mismo tipo.",
		"learn.extras.title": "Para el frío",
		"learn.extras.rule": "{t} o menos ({w} con viento)",
		"learn.smart.title": "Dos buenos hábitos",
		"learn.smart.once": "Vístete una vez: si llueve más tarde, el chubasquero desde la mañana.",
		"learn.smart.bag": "¿No hace falta ahora, pero sí luego? A la mochila.",
		"bring.title": "Llévate",
		"bring.itemWindow": "{item} para {window}",
		"bring.itemPart": "{item} {when}",
		"bag.title": "Mochila {when}",
		"bag.out": "sacar",
		"bag.in": "guardar",
		"bag.stay": "en la mochila",
		"bag.more": "+{n} más",
		"bag.less": "Ver menos",
		"bag.badge.pack": "{n} para llevar",
		"bag.badge.out": "{n} para sacar de la mochila",
		"bag.badge.in": "{n} para guardar en la mochila",
		"bag.sayOut": "Saca: {items}",
		"bag.sayIn": "Guarda: {items}",
		"bag.sayStay": "Sigue en la mochila: {items}",
		"kids.fromBag": "Saca de la mochila y ponte",
		"kids.intoBag": "Quítate y guarda en la mochila",
		"kids.stillInBag": "Sigue en tu mochila",
		"kids.sayStillInBag": "Sigue en tu mochila: {items}.",
		"kids.sayFromBag": "Saca de la mochila y ponte: {items}.",
		"kids.sayIntoBag": "Quítate y guarda en la mochila: {items}.",
		"kids.bag": "Guarda en tu mochila",
		"kids.sayBag": "Guarda en tu mochila: {items}.",
		"speech.bring": "Llévate: {items}.",
		"noun.days.one": "día",
		"noun.days.other": "días",
		"noun.pieces.one": "prenda",
		"noun.pieces.other": "prendas",
		"trip.title": "Planear un viaje",
		"trip.where": "¿Adónde vas?",
		"trip.pack": "Hacer mi maleta",
		"trip.change": "Cambiar viaje",
		"trip.clear": "Borrar viaje",
		"trip.loading": "Mirando el tiempo allí…",
		"trip.error": "No se pudo obtener el tiempo para este viaje. Inténtalo de nuevo.",
		"trip.datesError": "Revisa las fechas: hasta 30 días, desde hoy.",
		"trip.headline": "{n|days} en {place}",
		"trip.count": "Unas {n|pieces} en la maleta",
		"trip.feels": "Sensación de {from} a {to}.",
		"trip.chip.rain": "Días de lluvia: {n}",
		"trip.chip.sun": "Días de sol: {n}",
		"trip.chip.wind": "Días de viento: {n}",
		"trip.chip.snow": "Días de nieve: {n}",
		"trip.source.forecast": "Según la previsión.",
		"trip.source.typical": "Aún falta mucho para una previsión, así que usamos el tiempo de esas mismas fechas en los diez últimos años.",
		"trip.source.mixed": "Previsión hasta el {date}. Después, el tiempo habitual: las mismas fechas en los diez últimos años (los días con borde discontinuo).",
		"trip.typicalDay": "tiempo habitual",
		"trip.basics": "Y ropa interior para {n|days}.",
		"trip.laundry": "Más de una semana: contamos con un lavado.",
		"trip.packed": "{done} de {total} en la maleta",
		"trip.packedLabel": "En la maleta",
		"trip.allPacked": "¡Maleta lista!",
		"settings.kids": "Niños",
		"settings.clear.ticks": "Vaciar la lista",
		"settings.clear.best": "Borrar el récord",
		"settings.clear.stickers": "Vaciar el álbum de pegatinas",
		"settings.clear.ticks.confirm": "¿Desmarcar la lista de los niños y poner el cronómetro a cero?",
		"settings.clear.best.confirm": "¿Olvidar el tiempo más rápido en este dispositivo?",
		"settings.clear.stickers.confirm": "¿Quitar todas las pegatinas del álbum? No se puede deshacer.",
		"settings.clear.yes": "Sí, borrar",
		"settings.cleared": "Borrado",
		"trip.untickAll": "Desmarcar todo",
		"trip.undoUntick": "Deshacer: volver a marcarlo todo",
		"trip.unticked": "Todo desmarcado",
		"timer.start": "Iniciar el cronómetro",
		"timer.pause": "Pausar el cronómetro",
		"timer.resume": "Seguir",
		"timer.again": "Otra vez",
		"timer.hold": "Mantén pulsado el cronómetro para empezar de nuevo",
		"timer.go": "¡Ya!",
		"timer.started": "Cronómetro en marcha. ¡Ya!",
		"timer.paused": "Cronómetro en pausa",
		"timer.resumed": "Cronómetro en marcha otra vez",
		"timer.cleared": "Todo borrado. Empieza cuando quieras.",
		"timer.readyIn": "Listo en {time}",
		"timer.newBest": "¡Nuevo récord!",
		"timer.yourBest": "Tu récord: {time}",
		"timer.dur.s": "{s|seconds}",
		"timer.dur.m": "{m|minutes}",
		"timer.dur.ms": "{m|minutes} {s|seconds}",
		"noun.minutes.one": "minuto",
		"noun.minutes.other": "minutos",
		"noun.seconds.one": "segundo",
		"noun.seconds.other": "segundos",
		"item.hikingBoots": "Botas de montaña",
		"item.swimwear": "Bañador",
		"item.swimsuit": "Traje de baño",
		"item.flipflops": "Chanclas",
		"item.goggles": "Gafas de esquí",
		"item.smartOutfit": "Camisa",
		"item.dress": "Vestido",
		"item.smartShoes": "Zapatos de vestir",
		"item.sportswear": "Ropa deportiva",
		"item.runningShoes": "Zapatillas de correr",
		"item.dayBag": "Mochila pequeña",
		"item.towel": "Toalla de playa",
		"item.skiJacket": "Chaqueta de esquí",
		"item.skiPants": "Pantalón de esquí",
		"item.fleece": "Forro polar",
		"item.headTorch": "Linterna frontal",
		"item.cyclingShorts": "Culotte de ciclismo",
		"item.bikeLight": "Luz de bici",
		"item.helmet": "Casco",
		"act.hike": "Senderismo",
		"act.beach": "Playa y baño",
		"act.snow": "Nieve y esquí",
		"act.out": "Salir",
		"act.sport": "Deporte y correr",
		"act.city": "Pasear por la ciudad",
		"act.work": "Trabajo",
		"act.camp": "Camping",
		"act.cycle": "Ciclismo",
		"act.level.1": "Una vez",
		"act.level.2": "Unos días",
		"act.level.3": "Casi todos los días",
		"trip.what": "¿Qué vas a hacer?",
		"trip.optional": "Opcional",
		"trip.what.hint": "Toca una actividad para añadirla, otra vez para más días y una vez más para quitarla.",
		"trip.for": "para: {what}",
		"trip.group.active": "Ropa para actividades",
		"trip.group.gear": "Equipo",
		"kids.stickers.title": "Mis pegatinas",
		"kids.stickers.got": "¡Tienes una pegatina!",
		"kids.stickers.count": "Pegatinas: {n}",
		"kids.stickers.empty": "¡Prepárate por la mañana y el tiempo de hoy será tu primera pegatina!",
		"kids.sticker.sun": "Soleado",
		"kids.sticker.partly": "Sol y nubes",
		"kids.sticker.cloud": "Nublado",
		"kids.sticker.rain": "Lluvioso",
		"kids.sticker.snow": "Nieve",
		"kids.sticker.storm": "Tormenta",
		"kids.sticker.fog": "Niebla",
		"kids.sticker.rainbow": "Arcoíris",
		"kids.sticker.frost": "¡Primera helada!",
		"kids.sticker.shorts": "¡Vuelven los pantalones cortos!",
		"cmp.warmer": "{deg} más que ayer.",
		"cmp.warmer.today": "{deg} más que hoy.",
		"cmp.warmer.item": "{deg} más que ayer: {item} se puede quedar en casa.",
		"cmp.warmer.item.today": "{deg} más que hoy: {item} se puede quedar en casa.",
		"cmp.colder": "{deg} menos que ayer.",
		"cmp.colder.today": "{deg} menos que hoy.",
		"cmp.colder.item": "{deg} menos que ayer: añade {item}.",
		"cmp.colder.item.today": "{deg} menos que hoy: añade {item}.",
		"cmp.rain": "Lluvia hoy, a diferencia de ayer: una capa impermeable encima.",
		"cmp.rain.today": "Lluvia mañana, a diferencia de hoy: una capa impermeable encima.",
		"cmp.rain.umbrella": "Lluvia hoy, a diferencia de ayer: el paraguas vuelve a la mochila.",
		"cmp.rain.umbrella.today": "Lluvia mañana, a diferencia de hoy: el paraguas vuelve a la mochila.",
		"cmp.dry": "Seco hoy tras la lluvia de ayer: no hace falta paraguas.",
		"cmp.dry.today": "Seco mañana tras la lluvia de hoy: no hace falta paraguas.",
		"cmp.firstShorts": "¡Vuelven los pantalones cortos! El primer día para ellos en más de un mes.",
		"cmp.firstFrost": "Primera helada en más de un mes: abrígate bien.",
		"cmp.firstCoat": "Vuelve el tiempo de abrigo: el primer día de abrigo en más de un mes.",
		"cmp.firstSunscreen": "Vuelve el sol fuerte: protector solar por primera vez en más de un mes.",
		"cmp.kids.warmer": "¡Más calor que ayer!",
		"cmp.kids.warmer.today": "¡Mañana hará más calor!",
		"cmp.kids.colder": "¡Más frío que ayer!",
		"cmp.kids.colder.today": "¡Mañana hará más frío!",
		"cmp.kids.rain": "¡Hoy llueve!",
		"cmp.kids.rain.today": "¡Mañana llueve!",
		"cmp.kids.dry": "¡Hoy no llueve!",
		"cmp.kids.dry.today": "¡Mañana no llueve!",
		"cmp.kids.firstShorts": "¡Vuelven los pantalones cortos!",
		"cmp.kids.firstFrost": "¡Primera helada!",
		"cmp.kids.firstCoat": "¡Hora del abrigo!",
		"cmp.kids.firstSunscreen": "¡Hora del protector solar!",
		"ptr.pull": "Desliza para actualizar",
		"ptr.release": "Suelta para actualizar",
		"trip.packedCount": "{done} de {total}",
		"trip.days": "Tu viaje",
		"trip.group.tops": "Parte de arriba",
		"trip.group.warm": "Capas de abrigo",
		"trip.group.legs": "Piernas",
		"trip.group.shoes": "Pies",
		"trip.group.head": "Cabeza",
		"trip.group.extras": "Accesorios",
		"trip.item.packed": "{item} ×{qty}, en la maleta",
		"trip.item.todo": "{item} ×{qty}, todavía no",
		"item.top": "Blusa",
		"item.hoodie": "Sudadera",
		"item.skirt": "Falda",
		"settings.style": "Estilo de ropa",
		"settings.style.girl": "Niña",
		"settings.style.boy": "Niño",
		"hl.tshirt@girl": "Tiempo de blusa ligera.",
		"hl.tshirt.when@girl": "Tiempo de blusa ligera {when}.",
		"hl.sun@boy": "Gorra y protector solar.",
		"hl.sunhat@boy": "Gorra puesta.",
		"head.title.sunhat@boy": "Gorra {when}",
		"legs.title.shorts@girl": "Día de falda",
		"legs.detail.shortsLater@girl": "{when} hace calor para falda.",
		"item.cardigan": "Rebeca",
		"item.tights": "Leotardos",
		"legs.title.thermals@girl": "Pantalón + leotardos",
		"legs.detail.thermals@girl": "Unos leotardos calentitos debajo del pantalón.",
		"label.hoodUp": "Capucha",
		"note.swapped": "en su lugar",
		"note.tooWindy": "mucho viento",
		"state.on": "hace falta",
		"state.off": "no hace falta",
		"card.layers": "Capas",
		"card.shoes": "Pies",
		"card.head": "Cabeza",
		"card.rain": "Lluvia",
		"card.extras": "Accesorios",
		"hl.bundle": "Abrígate mucho.",
		"hl.bundle.when": "Abrígate mucho {when}.",
		"hl.wrap": "Abrígate.",
		"hl.wrap.when": "Abrígate {when}.",
		"hl.layer": "Una capa ligera encima.",
		"hl.layer.when": "Una capa ligera encima {when}.",
		"hl.tshirt": "Tiempo de camiseta.",
		"hl.tshirt.when": "Tiempo de camiseta {when}.",
		"hl.light": "Ropa ligera.",
		"hl.light.when": "Ropa ligera {when}.",
		"hl.rainjacket": "Chubasquero, no paraguas.",
		"hl.umbrella": "Llévate el paraguas.",
		"hl.snow": "Botas de nieve puestas.",
		"hl.sun": "Sombrero y protector solar.",
		"hl.windy": "Viento: algo cortavientos encima.",
		"hl.dry": "No se espera lluvia.",
		"hl.sun.cap": "Gorra y protector solar.",
		"hl.sunhat": "Sombrero puesto.",
		"hl.cap": "Gorra puesta.",
		"hl.sunscreen": "Protector solar.",
		"hl.sunglasses": "Gafas de sol.",
		"sum.change": "{from} al principio, {to} después.",
		"sum.same": "{word} todo el día.",
		"sum.rain": "Lluvia {window}.",
		"sum.snow": "Viene nieve.",
		"sum.dry": "Sin lluvia.",
		"sum.gusts": "Rachas de hasta {speed}.",
		"chip.feels": "Sensación {value}",
		"chip.feelsRange": "Sensación {from} → {to}",
		"chip.rain": "Lluvia {window}",
		"chip.snow": "Nieve",
		"chip.dry": "Seco",
		"chip.windy": "Viento {when}",
		"layers.title.same": "{n|layers} todo el día",
		"layers.title.change": "{a|layers}, luego {b}",
		"layers.detail.off": "{item}: fuera {when}.",
		"layers.detail.offBack": "{item}: fuera {off}, otra vez {back}.",
		"layers.detail.on": "{item}: también {when}.",
		"layers.detail.rainOuter": "Hoy, el chubasquero como capa exterior.",
		"layers.detail.wind": "Elige una capa exterior cortavientos.",
		"layers.detail.steady": "No hace falta cambiarse.",
		"shoes.title.sandals": "Día de sandalias",
		"shoes.title.sneakers": "Calzado de siempre",
		"shoes.title.rainboots": "Calzado impermeable",
		"shoes.title.snowboots": "Botas de nieve",
		"shoes.detail.sandals": "Calor y seco. Deja respirar los pies.",
		"shoes.detail.sneakers": "Suelo seco. Cualquier calzado cómodo sirve.",
		"shoes.detail.rainboots": "Charcos {window}. Mantén los calcetines secos.",
		"shoes.detail.snowboots": "Nieve en el suelo. Botas cálidas que agarren.",
		"head.title.none": "Sin gorro hoy",
		"head.title.beanie": "Gorro {when}",
		"head.title.sunhat": "Sombrero {when}",
		"head.title.cap": "Gorra {when}",
		"head.detail.cold": "Para tener las orejas calentitas.",
		"head.detail.coldWind": "Viento frío: tapa las orejas.",
		"head.detail.sun": "Sol fuerte: protege la cara y el cuello.",
		"head.detail.windySun": "Sol y rachas: la gorra aguanta mejor que un sombrero.",
		"head.detail.hood": "La capucha te cubre de la lluvia.",
		"head.detail.hoodLater": "Cuando llueva, la capucha.",
		"head.detail.none": "Templado y sin sol fuerte.",
		"rain.title.none": "No se espera lluvia",
		"rain.detail.none": "Deja el paraguas en casa.",
		"rain.title.umbrella": "Lleva paraguas",
		"rain.detail.window": "Lluvia {window}.",
		"rain.detail.windyLater": "Demasiado viento {when}: capucha.",
		"rain.title.skipUmbrella": "Olvida el paraguas",
		"rain.detail.windy": "Rachas de hasta {speed} le darán la vuelta. Mejor la capucha.",
		"rain.title.snow": "Viene nieve",
		"rain.detail.snow": "Capucha y cremallera hasta arriba.",
		"extras.title.none": "Nada más",
		"extras.detail.cold": "Para las horas frías.",
		"extras.detail.coldWind": "El viento hace que se sienta más frío.",
		"extras.detail.sun": "UV hasta {value}. Protege la piel y los ojos.",
		"extras.detail.none": "No hace falta protección solar.",
		"numbers.title": "Datos del tiempo",
		"numbers.summary": "{from} → {to} · lluvia {prob} · rachas {speed}",
		"numbers.temp": "Temperatura",
		"numbers.feels": "Sensación",
		"numbers.rain": "Lluvia",
		"numbers.wind": "Viento",
		"numbers.uv": "Índice UV",
		"numbers.daylight": "Luz del día",
		"numbers.sub.range": "mín → máx",
		"numbers.sub.rain": "{amount} en total",
		"numbers.sub.gusts": "rachas de hasta {speed}",
		"numbers.sub.daylight": "amanecer – atardecer",
		"uv.low": "bajo",
		"uv.moderate": "moderado",
		"uv.high": "alto",
		"uv.veryHigh": "muy alto",
		"uv.extreme": "extremo",
		"kids.put": "Ponte",
		"kids.notToday": "Hoy no",
		"kids.takeOff": "Quítate",
		"kids.tooWindy": "Mucho viento",
		"kids.ready": "¡Listo para salir!",
		"kids.readyTomorrow": "¡Todo listo para mañana!",
		"kids.mute": "Silenciar la voz",
		"kids.progress": "{done} de {total}",
		"kids.getReady": "Nos preparamos",
		"kids.say": "Ponte {items}.",
		"kids.sayUmbrella": "Llévate el paraguas.",
		"kids.sayNoUmbrella": "¡Hoy sin paraguas, hace mucho viento!",
		"kids.sayTakeOff": "Quítate {items}.",
		"kids.itemOn": "{item}, puesto",
		"kids.itemNotYet": "{item}, todavía no",
		"kids.itemPacked": "{item}, en la mochila",
		"kids.itemNotPacked": "{item}, todavía no está en la mochila",
		"speech.wear": "Ponte {items}.",
		"settings.open": "Ajustes",
		"settings.title": "Ajustes",
		"settings.language": "Idioma",
		"settings.units": "Unidades",
		"settings.feel": "Normalmente tengo…",
		"settings.feel.cold": "Frío",
		"settings.feel.normal": "Normal",
		"settings.feel.hot": "Calor",
		"settings.done": "Listo",
		"settings.credit": "Datos del tiempo: Open-Meteo.com (CC BY 4.0)",
		"loc.open": "Cambiar lugar",
		"loc.title": "¿Dónde estás?",
		"loc.useMine": "Usar mi ubicación",
		"loc.myLocation": "Mi ubicación",
		"loc.here": "Aquí",
		"loc.search": "Busca tu ciudad",
		"loc.searching": "Buscando…",
		"loc.noResults": "No se encontraron lugares",
		"loc.denied": "La ubicación está desactivada. Busca tu ciudad.",
		"loc.close": "Cerrar",
		"status.loading": "Mirando el cielo…",
		"status.waitingNet": "Esperando conexión…",
		"status.error": "No se pudo cargar el tiempo. Revisa tu conexión.",
		"status.retry": "Reintentar",
		"status.saved": "Mostrando la última previsión guardada.",
		"warn.heading": "Avisos meteorológicos oficiales",
		"warn.level.2": "Aviso amarillo",
		"warn.level.3": "Aviso naranja",
		"warn.level.4": "Aviso rojo",
		"warn.type.0": "Tiempo",
		"warn.type.1": "Viento",
		"warn.type.2": "Nieve y hielo",
		"warn.type.3": "Tormentas",
		"warn.type.4": "Niebla",
		"warn.type.5": "Calor",
		"warn.type.6": "Frío",
		"warn.type.7": "Costeros",
		"warn.type.8": "Incendios forestales",
		"warn.type.9": "Aludes",
		"warn.type.10": "Lluvia",
		"warn.type.12": "Inundaciones",
		"warn.type.13": "Lluvia e inundaciones",
		"warn.type.15": "Sequía",
		"warn.until": "Hasta {time}",
		"warn.more": "Detalles",
		"warn.issued": "Emitido por {sender}, {time}",
		"warn.source.meteoalarm": "Más en meteoalarm.org",
		"warn.source.nws": "Más en weather.gov",
		"warn.kids": "Pregunta a un adulto qué hacer.",
		"warn.credit": "Avisos meteorológicos: EUMETNET – MeteoAlarm y los servicios meteorológicos nacionales; en EE. UU., el National Weather Service. Límites de regiones © EuroGeographics.",
		"a11y.skip": "Ir al contenido",
		"status.dayOver": "El día casi ha terminado, aquí tienes mañana."
	},
	bg: {
		"app.tagline": "Облечи се за времето, не за числата.",
		"mode.label": "Режим",
		"mode.everyone": "Големи (12+)",
		"mode.kids": "Деца (3–12)",
		"day.today": "Днес",
		"day.tomorrow": "Утре",
		readAloud: "Прочети ми",
		"readAloud.stop": "Спри четенето",
		"item.socks": "Резервни чорапи",
		"item.poncho": "Пончо за дъжд",
		"item.lipbalm": "Балсам за устни",
		"item.handwarmers": "Грейки за ръце",
		"item.fan": "Ветрило",
		"item.repellent": "Репелент",
		"item.mask": "Маска",
		"item.tissues": "Кърпички",
		"extras.detail.socks": "Мокър ден: резервен чифт {item} в раницата.",
		"extras.detail.poncho": "Твърде ветровито за чадър: пончото пази сухо.",
		"extras.detail.lipbalm": "Студен вятър или слънце върху сняг: устните бързо изсъхват.",
		"extras.detail.handwarmers": "Мразовито: грейки за джобовете.",
		"extras.detail.fan": "Много горещо: ветрилото помага.",
		"extras.detail.repellent": "Топло, влажно и тихо: комарите излизат.",
		"extras.detail.mask": "Дим или прах във въздуха: маската помага.",
		"extras.detail.tissues": "Много полени: кърпички и лекарството за алергия.",
		"settings.allergies": "Алергии или астма",
		"settings.yes": "Да",
		"settings.no": "Не",
		"settings.allergies.hint": "Кърпички в дни с много полени и маска по-рано при лош въздух.",
		"settings.eyes": "Цвят на очите",
		"settings.eyes.hint": "Светлите очи по-лесно се заслепяват, затова слънчевите очила идват по-рано.",
		"settings.eyes.brown": "Кафяви",
		"settings.eyes.hazel": "Лешникови",
		"settings.eyes.green": "Зелени",
		"settings.eyes.blue": "Сини",
		"learn.sense.socks": "Силен дъжд: резервни чорапи (за децата по-рано, те джапат).",
		"learn.sense.poncho": "Деца, дъжд с вятър, твърде силен за чадър: пончо вместо дъждобран.",
		"learn.sense.lipbalm": "Леден вятър или слънце върху сняг: балсам за устни.",
		"learn.sense.handwarmers": "При {t} и по-студено: грейки за ръце.",
		"learn.sense.fan": "От {t} за няколко часа: ветрило.",
		"learn.sense.repellent": "Топли, влажни и тихи вечери: репелент.",
		"learn.sense.mask": "Дим или прах във въздуха: маска.",
		"learn.sense.tissues": "Много полени, с включени алергии в Настройки: кърпички и лекарство.",
		"note.apply": "нанеси",
		"note.reapply": "поднови",
		"note.applyOnce": "веднъж",
		"note.applied": "вече е сложен",
		"bag.now": "сега",
		"extras.detail.sunOnce": "Извън лятото стига веднъж преди излизане: не е нужно да го носиш.",
		"extras.detail.sunLater": "По-късно силно слънце: сложи крем веднъж, преди да излезеш.",
		"extras.detail.sunCarry": "Вземи го с теб и го поднови по-късно.",
		"item.water": "Бутилка вода",
		"item.reflector": "Светлоотразител",
		"hl.storm": "Гръмотевици: качулка, без чадър.",
		"hl.icy": "Хлъзгаво е: обувки с грайфер.",
		"chip.storm": "Гръмотевици",
		"chip.icy": "Заледено",
		"note.storm": "мълнии",
		"rain.title.storm": "Буря: без чадър",
		"rain.detail.storm": "Качулката горе и остани вътре, ако можеш.",
		"shoes.detail.icy": "Възможен е лед. Обувки със здрав грайфер.",
		"shoes.detail.warmRain": "Топъл дъжд: сандалите изсъхват бързо.",
		"label.waterproofCoat": "Непромокаемо палто",
		"extras.detail.water": "Горещо е: пий много вода.",
		"extras.detail.reflector": "Тъмно или мъгливо: бъди добре видим.",
		"kids.storm": "Гръмотевици! Качулка",
		"kids.sayStorm": "Днес има гръмотевици: без чадър, сложи качулката!",
		"learn.sense.title": "Здрав разум",
		"learn.sense.storm": "Гръмотевици: без чадър, с качулка.",
		"learn.sense.ice": "Лед: обувки с грайфер.",
		"learn.sense.glare": "Слънце върху сняг: слънчеви очила.",
		"learn.sense.water": "От {t} за няколко часа: бутилка вода.",
		"learn.sense.warmRain": "Топъл дъжд: сандалите са наред.",
		"learn.sense.reflector": "Деца навън на тъмно преди 18:00 или в мъгла: светлоотразител.",
		"settings.style.women": "Дамски",
		"settings.style.men": "Мъжки",
		"settings.howItWorks": "Как работи",
		"settings.appearance": "Облик",
		"settings.appearance.auto": "Автоматично",
		"settings.appearance.light": "Светъл",
		"settings.appearance.dark": "Тъмен",
		"card.title.bagged": "{items} в раницата",
		"privacy.title": "Поверителност",
		"privacy.lead": "Без профили, без реклами, без проследяване и без бисквитки. Това, което настроиш, остава на устройството ти.",
		"privacy.device.title": "Какво остава на устройството ти",
		"privacy.device.body": "Настройките, местата, пътуванията и отметките ти, вечерните ти отговори, както и списъкът, най-доброто време и стикерите на децата се пазят само в този браузър. Никой друг не може да ги види. „Нулирай приложението“ в Настройки изтрива всичко.",
		"privacy.weather.title": "Какво се изпраща за времето",
		"privacy.weather.body": "За прогнозата, качеството на въздуха и времето през последните дни приложението изпраща местоположението на мястото до Open-Meteo (open-meteo.com). Времето от минали години за пътувания идва през нашия собствен сървър, който пита Open-Meteo веднъж за всяко място и пази копие за следващи пътувания там. Когато търсиш място, там отиват и думите, които пишеш, и езикът на приложението. За места в САЩ местоположението отива и до Националната метеорологична служба на САЩ (weather.gov) за нейните предупреждения. Предупрежденията в Европа идват от MeteoAlarm през нашия собствен сървър, който иска само предупрежденията за страната ти, никога местоположението ти.",
		"privacy.location.title": "Твоето местоположение",
		"privacy.location.body": "Приложението пита устройството ти за местоположението му само когато докоснеш „Използвай моето местоположение“. Пази се само околността (с точност около 1 км), никога точната точка: тя се пази на устройството ти и се изпраща, като всяко място, за да се вземе времето там. Винаги можеш вместо това да избереш място по име.",
		"privacy.server.title": "Нашият сървър",
		"privacy.server.body": "Приложението идва от нашия собствен сървър, през Cloudflare. Както при всеки сайт, те виждат IP адреса ти и кои файлове се зареждат. Това служи само за доставяне на приложението и за защитата му, никога за създаване на профил за теб.",
		"privacy.links.title": "Споделени връзки",
		"privacy.links.body": "Споделената връзка съдържа само нужното, за да се отвори същата страница: мястото, датите и дали е детският изглед. Никога другите ти настройки или нещо за теб.",
		"privacy.voice.title": "Четене на глас",
		"privacy.voice.body": "Четенето на глас използва гласовете на устройството ти. Някои браузъри вместо това използват онлайн гласове на производителя си (например тези на Google в Chrome), които получават четения текст.",
		"privacy.kids.title": "Деца",
		"privacy.kids.body": "Детският режим не събира нищо за детето. Списъкът, хронометърът и стикерите остават на устройството.",
		"privacy.feedback.title": "Вечерните ти отговори",
		"privacy.feedback.body": "Отговорите ти на „Как се оказаха съветите за днес?“ остават на устройството ти. Ако това някога се промени, тази страница ще го каже първо.",
		"privacy.updated": "Последна промяна: 30 септември 2026 г.",
		"readAloud.short": "Чуй",
		"evening.tomorrow": "Вечер е, затова ти показваме утре.",
		"evening.today": "Остатъкът от днес",
		"feedback.face.cold": "Твърде студено",
		"feedback.face.good": "Точно както трябва",
		"feedback.face.hot": "Твърде топло",
		"trip.when": "Кога?",
		"trip.recent": "Скорошни пътувания",
		"page.today": "Layers Weather - Какво да облека и да взема днес?",
		"page.tomorrow": "Layers Weather - Какво да облека и да взема утре?",
		"page.plan": "Layers Weather - Какво да взема за пътуването?",
		"page.learn": "Layers Weather - Как работи?",
		"trip.popular": "Популярни",
		"trip.confidence": "Сигурност {pct}",
		"trip.confidence.hint": "Колко може да се вярва на времето толкова напред: висока за следващите дни, по-ниска след седмица, а след 16 дни само ориентир от минали години.",
		"trip.pickStart": "Докосни първия ден",
		"trip.pickEnd": "Сега докосни последния ден",
		"trip.span": "{n|days}",
		"trip.prevMonth": "Предишен месец",
		"trip.nextMonth": "Следващ месец",
		"trip.copied": "Копирано",
		"share.copyLink": "Копирай връзката",
		"link.viewing": "Разглеждаш {place}",
		"link.keep": "Запази",
		"link.back": "Обратно към {place}",
		"link.setup": "Настрой за мен",
		"link.sharedPlace": "Споделено място",
		"link.kidsView": "Детски изглед",
		"link.grownUps": "Изглед за възрастни",
		"wiz.where.use": "Използвай {place}",
		"trip.act.edit": "Промени",
		"trip.act.share": "Сподели",
		"trip.act.clear": "Изчисти",
		"gate.title": "Само за големи",
		"gate.ask": "Колко е {a} по {b}?",
		"gate.wrong": "Не съвсем. Опитай пак.",
		"gate.delete": "Изтрий",
		"face.cold": "Брр, студено",
		"face.good": "Приятно",
		"face.hot": "Горещо",
		"kids.sayWeather": "{when} е {word}.",
		"kids.onSay": "{item} – готово!",
		"kids.packedSay": "{item} – в раницата!",
		"kids.tapToHear": "Докосни, за да чуеш",
		"learn.kids.rain": "Вали? Вземи си чадъра.",
		"learn.kids.windyRain": "Дъжд и силен вятър? Качулката горе, без чадър.",
		"learn.kids.wind": "Ветровито? Закопчай якето.",
		"learn.kids.boots": "Локви? Гумени ботуши! Сняг? Зимни ботуши!",
		"learn.kids.sun": "Силно слънце? Шапка, слънцезащитен крем и слънчеви очила.",
		"gate.n3": "три",
		"gate.n4": "четири",
		"gate.n5": "пет",
		"gate.n6": "шест",
		"gate.n7": "седем",
		"gate.n8": "осем",
		"gate.n9": "девет",
		"strip.label": "Твоят ден",
		"strip.feels": "усеща се {value}",
		"noun.layers.one": "слой",
		"noun.layers.other": "слоя",
		"part.morning": "Сутрин",
		"part.afternoon": "Следобед",
		"part.evening": "Вечер",
		"when.all": "през целия ден",
		"when.morning": "сутринта",
		"when.afternoon": "следобед",
		"when.evening": "вечерта",
		"short.morning": "сутрин",
		"short.afternoon": "следобед",
		"short.evening": "вечер",
		"word.freezing": "мразовито",
		"word.cold": "студено",
		"word.chilly": "хладно",
		"word.cool": "прохладно",
		"word.mild": "меко",
		"word.warm": "топло",
		"word.hot": "горещо",
		"item.tshirt": "Тениска",
		"item.longsleeve": "Блуза",
		"item.sweater": "Пуловер",
		"item.jacket": "Яке",
		"item.rainjacket": "Дъждобран",
		"item.coat": "Зимно палто",
		"item.sandals": "Сандали",
		"item.sneakers": "Маратонки",
		"item.rainboots": "Гумени ботуши",
		"item.snowboots": "Зимни ботуши",
		"item.sunhat": "Шапка за слънце",
		"item.cap": "Шапка с козирка",
		"item.beanie": "Зимна шапка",
		"item.umbrella": "Чадър",
		"item.sunglasses": "Слънчеви очила",
		"item.sunscreen": "Слънцезащитен крем",
		"item.scarf": "Шал",
		"item.gloves": "Ръкавици",
		"item.shorts": "Къси панталони",
		"item.trousers": "Панталон",
		"item.thermals": "Термо клин",
		"item.snowpants": "Ски панталон",
		"card.legs": "Крака",
		"legs.title.shorts": "Време за къси панталони",
		"legs.title.trousers": "Дълъг панталон",
		"legs.title.warmTrousers": "Топъл панталон",
		"legs.title.thermals": "Панталон + термо клин",
		"legs.title.snowpants": "Ски панталон",
		"legs.detail.shorts": "Достатъчно топло за голи крака.",
		"legs.detail.trousers": "Лек панталон е достатъчен.",
		"legs.detail.warmTrousers": "Дънки или нещо по-дебело.",
		"legs.detail.thermals": "Клин или термобельо под панталона.",
		"legs.detail.snowpants": "Ски панталонът отгоре пази топло и сухо.",
		"legs.detail.shortsLater": "{when} е достатъчно топло за къси панталони.",
		"strip.past": "отминало",
		"strip.pick": "Покажи какво да облечеш в тази част от деня",
		"view.heading": "Какво да облечеш {when}",
		"summary.open": "Още подробности за деня",
		"summary.close": "Скрий подробностите",
		"layers.detail.partWord": "{when} е {word}.",
		"note.takeOff": "свали",
		"note.putOn": "облечи",
		"feedback.title": "Как се оказаха съветите за днес?",
		"feedback.kids.title": "Удобно ли ти беше днес?",
		"feedback.thanks": "Благодарим! Това ни помага да станем по-добри.",
		"feedback.close": "Затвори",
		"feedback.face.meh": "Не съвсем",
		"feedback.why": "Беше ли ти студено или горещо с това, което предложихме?",
		"feedback.kids.why": "Беше ли ти студено или горещо?",
		"feedback.other": "Нещо друго",
		"feedback.warmer": "Разбрано. Отсега ще те обличаме малко по-топло.",
		"feedback.lighter": "Разбрано. Отсега ще те обличаме малко по-леко.",
		"feedback.atWarmest": "Благодаря! Съветите вече са възможно най-топли.",
		"feedback.atLightest": "Благодаря! Съветите вече са възможно най-леки.",
		"feedback.undo": "Отмени",
		"feedback.undone": "Отменено. Съветите остават както бяха.",
		"wiz.hello": "Здравей! Нека настроим Layers Weather",
		"wiz.step": "Стъпка {n} от {total}",
		"wiz.who.title": "Кой се облича?",
		"wiz.who.adult": "Аз",
		"wiz.who.adult.sub": "12+ години · първо думите, после дрехите",
		"wiz.who.kid": "Моето дете",
		"wiz.who.kid.sub": "3 до 12 години · само дрехите, като списък",
		"wiz.style.title": "Какви дрехи да показваме?",
		"wiz.feel.title": "Как се чувстваш обикновено навън?",
		"wiz.feel.cold": "Бързо ми става студено",
		"wiz.feel.normal": "Нормално",
		"wiz.feel.hot": "Бързо ми става топло",
		"wiz.where.title": "Последно: къде си?",
		"wiz.next": "Напред",
		"install.title": "Сложи го на началния екран",
		"install.why": "Отваряй Layers Weather с едно докосване всяка сутрин, като всяко друго приложение.",
		"install.go": "Добави към началния екран",
		"install.later": "Не сега",
		"install.ios.intro": "Две докосвания и е готово:",
		"install.ios.share": "Докосни бутона „Сподели“",
		"install.ios.add": "Избери „Добави към началния екран“",
		"install.ok": "Разбрах",
		"install.link": "Инсталирай приложението",
		"install.manual": "Отвори менюто на браузъра (⋮ или ⋯) и избери „Инсталиране на приложението“ или „Добавяне към началния екран“.",
		"wiz.back": "Назад",
		"settings.reset": "Нулирай приложението",
		"settings.refresh": "Обнови данните за времето",
		"settings.refresh.busy": "Обновяване…",
		"settings.refresh.done": "Времето е обновено",
		"settings.refresh.failed": "Неуспешно обновяване. Провери връзката.",
		"settings.reset.confirm": "Това изтрива настройките, мястото и отзивите ти на това устройство и започва настройката отначало.",
		"settings.reset.yes": "Да, нулирай",
		"settings.reset.cancel": "Отказ",
		"day.plan": "Пътуване",
		"brand.home": "Layers Weather, обратно към днес",
		"day.learn": "Научи",
		"learn.title": "Как да се обличаш за всяко време",
		"learn.sub": "Простите правила зад Layers Weather.",
		"learn.checks.title": "Проверяваме четири неща",
		"learn.check.feels": "Колко студено се усеща",
		"learn.check.rain": "Дъжд или сняг",
		"learn.check.wind": "Вятър",
		"learn.check.sun": "Силата на слънцето",
		"learn.checks.then": "…за сутринта, следобеда и вечерта. После избираме дрехите ти.",
		"learn.ladder.title": "Стълбата на слоевете",
		"learn.ladder.sub": "Колкото по-студено се усеща, толкова повече слоеве.",
		"learn.range.above": "{t} и повече",
		"learn.range.between": "от {from} до {to}",
		"learn.range.below": "под {t}",
		"learn.rung.hot": "Време за тениска",
		"learn.rung.warm": "Леки дрехи",
		"learn.rung.mild": "Лек слой отгоре",
		"learn.rung.cool": "Три слоя",
		"learn.rung.cold": "Палто, шапка и шал",
		"learn.rung.freezing": "Четири слоя и термо",
		"learn.feels.title": "Как се усеща, а не само числото",
		"learn.feels.wind": "Вятърът прави усещането по-студено.",
		"learn.feels.sun": "Слънцето прави усещането по-топло.",
		"learn.feels.you": "Често ти е студено или топло? Настройките местят стълбата с {n}.",
		"learn.rain.title": "Дъжд и вятър",
		"learn.rain.calm": "Дъжд, слаб вятър",
		"learn.rain.calmText": "Вземи чадър, когато шансът за дъжд е {p} или повече.",
		"learn.rain.windy": "Дъжд и силни пориви",
		"learn.rain.windyText": "Пориви от {s} обръщат чадъра. Облечи дъждобран с качулка.",
		"learn.wind.title": "Ветровито",
		"learn.wind.text": "При вятър от {s} избери горен слой, който спира вятъра. Широките шапки отлитат – сложи шапка с козирка.",
		"learn.boots.title": "Мокра земя",
		"learn.boots.text": "Шанс за дъжд от {p}: непромокаеми обувки. Сняг: зимни ботуши.",
		"learn.sun.title": "Силно слънце",
		"learn.sun.text": "От UV {uv}: шапка и слънцезащитен крем. Слънчеви очила, когато слънцето грее 2 часа или повече, от UV {uv2} за 2 часа или повече, или при слънце върху сняг.",
		"learn.sun.season": "Извън лятото слънцезащитен крем само от UV {uv}, веднъж преди излизане. През лятото отива в раницата, за подновяване.",
		"learn.sun.hatCold": "Шапка за слънце или с козирка само от усещане {t} нагоре, а извън лятото от UV {uv}. Една шапка на ден: ако денят иска зимна шапка, тя е шапката.",
		"learn.legs.title": "Крака и стъпала",
		"learn.range.atOrBelow": "{t} и по-малко",
		"learn.legs.snow": "Сняг и {t} или по-студено",
		"learn.feet.sandals": "{t} и повече, сухо",
		"learn.feet.sneakers": "Повечето дни",
		"learn.feet.rain": "Дъжд {p}+",
		"item.socksShort": "Къси чорапи",
		"item.socksEveryday": "Чорапи",
		"item.socksWool": "Вълнени чорапи",
		"item.socksThermal": "Термо чорапи до коляното",
		"item.socksEveryday@kids": "Чорапи",
		"item.socksWool@kids": "Топли чорапи",
		"item.socksThermal@kids": "Чорапи за сняг",
		"shoes.title.light": "Леки обувки",
		"label.socks": "Чорапи",
		"feet.socks.none": "Днес без чорапи.",
		"feet.socks.short": "Късите чорапи държат краката хладни в маратонките.",
		"feet.socks.wool": "Студен ден: вълнените чорапи топлят пръстите.",
		"feet.socks.woolBoots": "Гумените ботуши не топлят, затова вълнени чорапи.",
		"feet.socks.thermal": "Мразовито: термо чорапи до коляното.",
		"feet.socks.thermalSnow": "Термо чорапите до коляното пазят ботушите от сняг.",
		"learn.socks.title": "Чорапи",
		"learn.socks.noneLabel": "Без чорапи",
		"learn.socks.none": "Със сандали",
		"learn.socks.short": "С маратонки, {t} и повече цял ден",
		"learn.socks.everyday": "Повечето дни",
		"learn.socks.wool": "{t} и по-малко, или гумени ботуши под {r}",
		"learn.socks.thermal": "{t} и по-малко, или игра в снега",
		"learn.socks.note": "Избират се веднъж за деня, по най-студения час. Ботушите никога не са с къси чорапи. Резервният чифт в мокър ден е от същия вид.",
		"learn.extras.title": "За студа",
		"learn.extras.rule": "{t} и по-малко ({w} при вятър)",
		"learn.smart.title": "Два умни навика",
		"learn.smart.once": "Обличаш се веднъж: ако по-късно вали, дъждобранът е още от сутринта.",
		"learn.smart.bag": "Не ти трябва сега, но по-късно? Слагаш го в чантата.",
		"bring.title": "Вземи със себе си",
		"bring.itemWindow": "{item} за {window}",
		"bring.itemPart": "{item} {when}",
		"bag.title": "Раница {when}",
		"bag.out": "извади",
		"bag.in": "прибери",
		"bag.stay": "в раницата",
		"bag.more": "+{n} още",
		"bag.less": "По-малко",
		"bag.badge.pack": "{n} за раницата",
		"bag.badge.out": "{n} за изваждане",
		"bag.badge.in": "{n} за прибиране",
		"bag.sayOut": "Извади: {items}",
		"bag.sayIn": "Прибери: {items}",
		"bag.sayStay": "Остава в раницата: {items}",
		"kids.fromBag": "Извади от раницата и сложи",
		"kids.intoBag": "Свали и прибери в раницата",
		"kids.stillInBag": "Остава в раницата",
		"kids.sayStillInBag": "Остава в раницата: {items}.",
		"kids.sayFromBag": "Извади от раницата и сложи: {items}.",
		"kids.sayIntoBag": "Свали и прибери в раницата: {items}.",
		"kids.bag": "Прибери в раницата",
		"kids.sayBag": "Прибери в раницата: {items}.",
		"speech.bring": "Вземи със себе си: {items}.",
		"noun.days.one": "ден",
		"noun.days.other": "дни",
		"noun.pieces.one": "вещ",
		"noun.pieces.other": "вещи",
		"trip.title": "Планирай пътуване",
		"trip.where": "Къде отиваш?",
		"trip.pack": "Подготви багажа",
		"trip.change": "Промени пътуването",
		"trip.clear": "Изчисти пътуването",
		"trip.loading": "Проверяваме времето там…",
		"trip.error": "Не успяхме да вземем времето за това пътуване. Опитай пак.",
		"trip.datesError": "Провери датите: до 30 дни, от днес нататък.",
		"trip.headline": "{n|days} в {place}",
		"trip.count": "Около {n|pieces} за багажа",
		"trip.feels": "Усеща се от {from} до {to}.",
		"trip.chip.rain": "Дъждовни дни: {n}",
		"trip.chip.sun": "Слънчеви дни: {n}",
		"trip.chip.wind": "Ветровити дни: {n}",
		"trip.chip.snow": "Снежни дни: {n}",
		"trip.source.forecast": "По прогнозата.",
		"trip.source.typical": "Твърде далеч за прогноза, затова ползваме времето за същите дати през последните десет години.",
		"trip.source.mixed": "Прогноза до {date}. След това – обичайното време: същите дати през последните десет години (дните с пунктирана рамка).",
		"trip.typicalDay": "обичайно време",
		"trip.basics": "Плюс бельо за {n|days}.",
		"trip.laundry": "Повече от седмица – приемаме едно пране.",
		"trip.packed": "{done} от {total} прибрани",
		"trip.packedLabel": "Прибрани",
		"trip.allPacked": "Всичко е прибрано!",
		"settings.kids": "Деца",
		"settings.clear.ticks": "Изчисти списъка",
		"settings.clear.best": "Изчисти рекорда",
		"settings.clear.stickers": "Изпразни албума със стикери",
		"settings.clear.ticks.confirm": "Да махна отметките от детския списък и да нулирам хронометъра?",
		"settings.clear.best.confirm": "Да забравя най-бързото време за обличане на това устройство?",
		"settings.clear.stickers.confirm": "Да махна всички стикери от албума? Това не може да се върне.",
		"settings.clear.yes": "Да, изчисти",
		"settings.cleared": "Изчистено",
		"trip.untickAll": "Махни всички отметки",
		"trip.undoUntick": "Върни: отметни всички отново",
		"trip.unticked": "Всички отметки са махнати",
		"timer.start": "Пусни хронометъра",
		"timer.pause": "Спри хронометъра",
		"timer.resume": "Продължи",
		"timer.again": "Отначало",
		"timer.hold": "Задръж хронометъра, за да започнеш отначало",
		"timer.go": "Старт!",
		"timer.started": "Хронометърът тръгна. Старт!",
		"timer.paused": "Хронометърът е спрян",
		"timer.resumed": "Хронометърът продължава",
		"timer.cleared": "Всичко е изчистено. Започни, когато си готов.",
		"timer.readyIn": "Готов за {time}",
		"timer.newBest": "Нов рекорд!",
		"timer.yourBest": "Твоят рекорд: {time}",
		"timer.dur.s": "{s|seconds}",
		"timer.dur.m": "{m|minutes}",
		"timer.dur.ms": "{m|minutes} {s|seconds}",
		"noun.minutes.one": "минута",
		"noun.minutes.other": "минути",
		"noun.seconds.one": "секунда",
		"noun.seconds.other": "секунди",
		"item.hikingBoots": "Туристически обувки",
		"item.swimwear": "Плувни шорти",
		"item.swimsuit": "Бански",
		"item.flipflops": "Джапанки",
		"item.goggles": "Ски очила",
		"item.smartOutfit": "Риза",
		"item.dress": "Рокля",
		"item.smartShoes": "Официални обувки",
		"item.sportswear": "Спортни дрехи",
		"item.runningShoes": "Маратонки за бягане",
		"item.dayBag": "Малка раница",
		"item.towel": "Плажна кърпа",
		"item.skiJacket": "Ски яке",
		"item.skiPants": "Ски панталон",
		"item.fleece": "Полар",
		"item.headTorch": "Челник",
		"item.cyclingShorts": "Колоездачни шорти",
		"item.bikeLight": "Фар за колело",
		"item.helmet": "Каска",
		"act.hike": "Туризъм",
		"act.beach": "Плаж и плуване",
		"act.snow": "Сняг и ски",
		"act.out": "Излизане",
		"act.sport": "Спорт и бягане",
		"act.city": "Разходки в града",
		"act.work": "Работа",
		"act.camp": "Къмпинг",
		"act.cycle": "Колоездене",
		"act.level.1": "Веднъж",
		"act.level.2": "Няколко дни",
		"act.level.3": "Почти всеки ден",
		"trip.what": "Какво ще правиш?",
		"trip.optional": "По желание",
		"trip.what.hint": "Докосни занимание, за да го добавиш, отново за повече дни и още веднъж, за да го махнеш.",
		"trip.for": "за: {what}",
		"trip.group.active": "Дрехи за заниманията",
		"trip.group.gear": "Екипировка",
		"kids.stickers.title": "Моите стикери",
		"kids.stickers.got": "Получи стикер!",
		"kids.stickers.count": "Стикери досега: {n}",
		"kids.stickers.empty": "Облечи се сутринта и днешното време става първият ти стикер!",
		"kids.sticker.sun": "Слънчево",
		"kids.sticker.partly": "Слънце и облаци",
		"kids.sticker.cloud": "Облачно",
		"kids.sticker.rain": "Дъждовно",
		"kids.sticker.snow": "Сняг",
		"kids.sticker.storm": "Буря",
		"kids.sticker.fog": "Мъгла",
		"kids.sticker.rainbow": "Дъга",
		"kids.sticker.frost": "Първа слана!",
		"kids.sticker.shorts": "Късите панталони се връщат!",
		"cmp.warmer": "С {deg} по-топло от вчера.",
		"cmp.warmer.today": "С {deg} по-топло от днес.",
		"cmp.warmer.item": "С {deg} по-топло от вчера: {item} може да остане вкъщи.",
		"cmp.warmer.item.today": "С {deg} по-топло от днес: {item} може да остане вкъщи.",
		"cmp.colder": "С {deg} по-студено от вчера.",
		"cmp.colder.today": "С {deg} по-студено от днес.",
		"cmp.colder.item": "С {deg} по-студено от вчера: добави {item}.",
		"cmp.colder.item.today": "С {deg} по-студено от днес: добави {item}.",
		"cmp.rain": "Днес вали, за разлика от вчера: непромокаем слой отгоре.",
		"cmp.rain.today": "Утре вали, за разлика от днес: непромокаем слой отгоре.",
		"cmp.rain.umbrella": "Днес вали, за разлика от вчера: чадърът обратно в раницата.",
		"cmp.rain.umbrella.today": "Утре вали, за разлика от днес: чадърът обратно в раницата.",
		"cmp.dry": "Днес е сухо след вчерашния дъжд: без чадър.",
		"cmp.dry.today": "Утре е сухо след днешния дъжд: без чадър.",
		"cmp.firstShorts": "Късите панталони се връщат! Първият ден за тях от повече от месец.",
		"cmp.firstFrost": "Първа слана от повече от месец: облечи се топло.",
		"cmp.firstCoat": "Време е за палто: първият такъв ден от повече от месец.",
		"cmp.firstSunscreen": "Силното слънце се връща: слънцезащитен крем за първи път от повече от месец.",
		"cmp.kids.warmer": "По-топло от вчера!",
		"cmp.kids.warmer.today": "Утре е по-топло!",
		"cmp.kids.colder": "По-студено от вчера!",
		"cmp.kids.colder.today": "Утре е по-студено!",
		"cmp.kids.rain": "Днес вали!",
		"cmp.kids.rain.today": "Утре вали!",
		"cmp.kids.dry": "Днес не вали!",
		"cmp.kids.dry.today": "Утре не вали!",
		"cmp.kids.firstShorts": "Късите панталони се връщат!",
		"cmp.kids.firstFrost": "Първа слана!",
		"cmp.kids.firstCoat": "Време за палто!",
		"cmp.kids.firstSunscreen": "Време за слънцезащитен крем!",
		"ptr.pull": "Дръпни за обновяване",
		"ptr.release": "Пусни за обновяване",
		"trip.packedCount": "{done} от {total}",
		"trip.days": "Твоето пътуване",
		"trip.group.tops": "Горнища",
		"trip.group.warm": "Топли слоеве",
		"trip.group.legs": "Крака",
		"trip.group.shoes": "Стъпала",
		"trip.group.head": "Глава",
		"trip.group.extras": "Аксесоари",
		"trip.item.packed": "{item} ×{qty}, прибрано",
		"trip.item.todo": "{item} ×{qty}, още не",
		"item.top": "Блузка",
		"item.hoodie": "Суичър",
		"item.skirt": "Пола",
		"settings.style": "Стил на дрехите",
		"settings.style.girl": "Момиче",
		"settings.style.boy": "Момче",
		"hl.tshirt@girl": "Време за лека блузка.",
		"hl.tshirt.when@girl": "Време за лека блузка {when}.",
		"hl.sun@boy": "Шапка с козирка и слънцезащитен крем.",
		"hl.sunhat@boy": "Шапка с козирка.",
		"head.title.sunhat@boy": "Шапка с козирка {when}",
		"legs.title.shorts@girl": "Време за пола",
		"legs.detail.shortsLater@girl": "{when} е достатъчно топло за пола.",
		"item.cardigan": "Жилетка",
		"item.tights": "Чорапогащник",
		"legs.title.thermals@girl": "Панталон + чорапогащник",
		"legs.detail.thermals@girl": "Топъл чорапогащник под панталона.",
		"label.hoodUp": "Качулка",
		"note.swapped": "вместо яке",
		"note.tooWindy": "много вятър",
		"state.on": "нужно",
		"state.off": "не е нужно",
		"card.layers": "Слоеве",
		"card.shoes": "Стъпала",
		"card.head": "Глава",
		"card.rain": "Дъжд",
		"card.extras": "Аксесоари",
		"hl.bundle": "Облечи се много топло.",
		"hl.bundle.when": "Облечи се много топло {when}.",
		"hl.wrap": "Облечи се топло.",
		"hl.wrap.when": "Облечи се топло {when}.",
		"hl.layer": "Лек слой отгоре.",
		"hl.layer.when": "Лек слой отгоре {when}.",
		"hl.tshirt": "Време за тениска.",
		"hl.tshirt.when": "Време за тениска {when}.",
		"hl.light": "Леки дрехи.",
		"hl.light.when": "Леки дрехи {when}.",
		"hl.rainjacket": "Дъждобран, а не чадър.",
		"hl.umbrella": "Вземи чадър.",
		"hl.snow": "Обуй зимни ботуши.",
		"hl.sun": "Шапка и слънцезащитен крем.",
		"hl.windy": "Ветровито: нещо ветроупорно отгоре.",
		"hl.dry": "Не се очаква дъжд.",
		"hl.sun.cap": "Шапка с козирка и слънцезащитен крем.",
		"hl.sunhat": "Шапка за слънце.",
		"hl.cap": "Шапка с козирка.",
		"hl.sunscreen": "Слънцезащитен крем.",
		"hl.sunglasses": "Слънчеви очила.",
		"sum.change": "Първо {from}, после {to}.",
		"sum.same": "{word} през целия ден.",
		"sum.rain": "Дъжд {window}.",
		"sum.snow": "Идва сняг.",
		"sum.dry": "Без дъжд.",
		"sum.gusts": "Пориви до {speed}.",
		"chip.feels": "Усеща се {value}",
		"chip.feelsRange": "Усеща се {from} → {to}",
		"chip.rain": "Дъжд {window}",
		"chip.snow": "Сняг",
		"chip.dry": "Сухо",
		"chip.windy": "Ветровито {when}",
		"layers.title.same": "{n|layers} през целия ден",
		"layers.title.change": "{a|layers}, после {b}",
		"layers.detail.off": "{item} – сваля се {when}.",
		"layers.detail.offBack": "{item} – сваля се {off}, облича се пак {back}.",
		"layers.detail.on": "{item} – облича се {when}.",
		"layers.detail.rainOuter": "Днес дъждобранът е горният слой.",
		"layers.detail.wind": "Избери горен слой, който спира вятъра.",
		"layers.detail.steady": "Не е нужно да се преобличаш.",
		"shoes.title.sandals": "Време за сандали",
		"shoes.title.sneakers": "Обикновени обувки",
		"shoes.title.rainboots": "Непромокаеми обувки",
		"shoes.title.snowboots": "Зимни ботуши",
		"shoes.detail.sandals": "Топло и сухо. Остави краката да дишат.",
		"shoes.detail.sneakers": "Сухо навън. Става всичко удобно.",
		"shoes.detail.rainboots": "Локви {window}. Пази чорапите сухи.",
		"shoes.detail.snowboots": "Има сняг. Топли ботуши с грайфер.",
		"head.title.none": "Без шапка",
		"head.title.beanie": "Зимна шапка {when}",
		"head.title.sunhat": "Шапка за слънце {when}",
		"head.title.cap": "Шапка с козирка {when}",
		"head.detail.cold": "Пази ушите на топло.",
		"head.detail.coldWind": "Студен вятър, покрий ушите.",
		"head.detail.sun": "Силно слънце. Пази лицето и врата.",
		"head.detail.windySun": "Слънчево, но с пориви. Шапка с козирка стои по-добре.",
		"head.detail.hood": "Качулката те пази от дъжда.",
		"head.detail.hoodLater": "Когато вали, слагаш качулката.",
		"head.detail.none": "Меко и не твърде слънчево.",
		"rain.title.none": "Не се очаква дъжд",
		"rain.detail.none": "Остави чадъра вкъщи.",
		"rain.title.umbrella": "Вземи чадър",
		"rain.detail.window": "Дъжд {window}.",
		"rain.detail.windyLater": "{when} е твърде ветровито, сложи качулка.",
		"rain.title.skipUmbrella": "Без чадър",
		"rain.detail.windy": "Пориви до {speed} ще го обърнат. Сложи качулка.",
		"rain.title.snow": "Идва сняг",
		"rain.detail.snow": "Качулка и цип догоре.",
		"extras.title.none": "Нищо допълнително",
		"extras.detail.cold": "За студените часове.",
		"extras.detail.coldWind": "Вятърът го прави по-студено.",
		"extras.detail.sun": "UV до {value}. Пази кожата и очите.",
		"extras.detail.none": "Не е нужна защита от слънце.",
		"numbers.title": "Метео данни",
		"numbers.summary": "{from} → {to} · дъжд {prob} · пориви {speed}",
		"numbers.temp": "Температура",
		"numbers.feels": "Усеща се",
		"numbers.rain": "Дъжд",
		"numbers.wind": "Вятър",
		"numbers.uv": "UV индекс",
		"numbers.daylight": "Светлата част",
		"numbers.sub.range": "най-ниска → най-висока",
		"numbers.sub.rain": "{amount} общо",
		"numbers.sub.gusts": "пориви до {speed}",
		"numbers.sub.daylight": "изгрев – залез",
		"uv.low": "нисък",
		"uv.moderate": "умерен",
		"uv.high": "висок",
		"uv.veryHigh": "много висок",
		"uv.extreme": "екстремен",
		"kids.put": "Облечи",
		"kids.notToday": "Не днес",
		"kids.takeOff": "Свали",
		"kids.tooWindy": "Много вятър",
		"kids.ready": "Готов си!",
		"kids.readyTomorrow": "Всичко е готово за утре!",
		"kids.mute": "Изключи гласа",
		"kids.progress": "{done} от {total}",
		"kids.getReady": "Приготвяме се",
		"kids.say": "Облечи {items}.",
		"kids.sayUmbrella": "Вземи си чадъра.",
		"kids.sayNoUmbrella": "Днес без чадър, има много вятър!",
		"kids.sayTakeOff": "Свали {items}.",
		"kids.itemOn": "{item}, облечено",
		"kids.itemNotYet": "{item}, още не",
		"kids.itemPacked": "{item}, в раницата",
		"kids.itemNotPacked": "{item}, още не е в раницата",
		"speech.wear": "Облечи {items}.",
		"settings.open": "Настройки",
		"settings.title": "Настройки",
		"settings.language": "Език",
		"settings.units": "Мерни единици",
		"settings.feel": "Обикновено ми е…",
		"settings.feel.cold": "Студено",
		"settings.feel.normal": "Нормално",
		"settings.feel.hot": "Топло",
		"settings.done": "Готово",
		"settings.credit": "Данни за времето: Open-Meteo.com (CC BY 4.0)",
		"loc.open": "Смени мястото",
		"loc.title": "Къде си?",
		"loc.useMine": "Използвай моето местоположение",
		"loc.myLocation": "Моето местоположение",
		"loc.here": "Тук",
		"loc.search": "Търси град или село",
		"loc.searching": "Търсене…",
		"loc.noResults": "Няма намерени места",
		"loc.denied": "Местоположението е изключено. Потърси града си.",
		"loc.close": "Затвори",
		"status.loading": "Поглеждаме небето…",
		"status.waitingNet": "Чакаме връзка…",
		"status.error": "Прогнозата не се зареди. Провери връзката си.",
		"status.retry": "Опитай пак",
		"status.saved": "Показваме последната запазена прогноза.",
		"warn.heading": "Официални предупреждения за времето",
		"warn.level.2": "Жълт код",
		"warn.level.3": "Оранжев код",
		"warn.level.4": "Червен код",
		"warn.type.0": "Време",
		"warn.type.1": "Вятър",
		"warn.type.2": "Сняг и поледица",
		"warn.type.3": "Гръмотевични бури",
		"warn.type.4": "Мъгла",
		"warn.type.5": "Горещини",
		"warn.type.6": "Студ",
		"warn.type.7": "Крайбрежие",
		"warn.type.8": "Горски пожари",
		"warn.type.9": "Лавини",
		"warn.type.10": "Дъжд",
		"warn.type.12": "Наводнения",
		"warn.type.13": "Дъжд и наводнения",
		"warn.type.15": "Суша",
		"warn.until": "До {time}",
		"warn.more": "Подробности",
		"warn.issued": "Издадено от {sender}, {time}",
		"warn.source.meteoalarm": "Още в meteoalarm.org",
		"warn.source.nws": "Още в weather.gov",
		"warn.kids": "Попитай възрастен какво да правиш.",
		"warn.credit": "Предупреждения за времето: EUMETNET – MeteoAlarm и националните метеорологични служби; в САЩ – National Weather Service. Граници на регионите © EuroGeographics.",
		"a11y.skip": "Към съдържанието",
		"status.dayOver": "Денят почти свърши, ето утре."
	}
}, pe = R, me = {
	en: "en-GB",
	de: "de-DE",
	fr: "fr-FR",
	es: "es-ES",
	bg: "bg-BG"
}, z = (e, t) => e && e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
function he(e, t, n = "neutral", r = !1) {
	let i = fe[e], a = pe, o = e === "en" && t === "imperial" ? "en-US" : me[e], s = (e) => {
		let t = n === "neutral" ? void 0 : `${e}@${n}`;
		return (t && i[t]) ?? i[e] ?? (t && a[t]) ?? a[e] ?? e;
	}, c = (e) => L(e, n), l = (e, t = {}) => e.replace(/\{(\w+)\}/g, (e, n) => n in t ? String(t[n]) : ""), u = new Intl.PluralRules(o), d = new Intl.ListFormat(o, { type: "conjunction" }), f = t === "imperial" ? "h12" : "h23", p = new Intl.DateTimeFormat(o, {
		hour: "numeric",
		hourCycle: f
	}), m = new Intl.DateTimeFormat(o, {
		hour: "numeric",
		minute: "2-digit",
		hourCycle: f
	}), h = (e) => {
		let t = `item.${c(e)}`;
		return r && (i[`${t}@kids`] ?? a[`${t}@kids`]) || s(t);
	}, g = (t) => e === "de" ? h(t) : h(t).toLocaleLowerCase(o), _ = (e) => `${Math.round(t === "imperial" ? e * 9 / 5 + 32 : e)}°`, v = (e) => t === "imperial" ? `${Math.round(e * .621371)} mph` : `${Math.round(e)} km/h`, y = (e) => t === "imperial" ? `${(e / 25.4).toFixed(2)} in` : `${e < 10 ? e.toFixed(1) : Math.round(e)} mm`, b = (t) => e === "bg" && f === "h12" ? t.replace(/\s?ч\./g, "") : t, x = (e, t) => {
		let n = new Date(2e3, 0, 1, e), r = new Date(2e3, 0, 1, Math.min(t, 23), t >= 24 ? 59 : 0);
		try {
			return b(p.formatRange(n, r));
		} catch {
			return b(`${p.format(n)}–${p.format(r)}`);
		}
	}, S = (e, t) => b(m.format(new Date(2e3, 0, 1, e, t))), C = (e) => d.format(e), w = (e, t) => `${e} ${s(`noun.${t}.${u.select(e) === "one" ? "one" : "other"}`)}`, T = (e) => w(e, "layers"), E = (e, t) => t ? s("when.all") : C(e.map((e) => s(`when.${e}`))), D = (e) => {
		if (typeof e == "string" || typeof e == "number") return String(e);
		switch (e.kind) {
			case "parts": return E(e.parts, e.all);
			case "window": return x(e.from, e.to);
			case "items": return C(e.items.map(g));
			case "item": return g(e.item);
			case "word": return s(`word.${e.word}`);
			case "temp": return _(e.value);
			case "speed": return v(e.value);
		}
	}, O = (e, t = {}) => {
		let n = e.params ?? {}, r = s(e.key).replace(/\{(\w+)(?:\|(\w+))?\}/g, (e, t, r) => {
			let i = n[t];
			return i === void 0 ? "" : r && typeof i == "number" ? w(i, r) : D(i);
		});
		return t.capitalize === !1 ? r : z(r, o);
	};
	return {
		lang: e,
		locale: o,
		units: t,
		style: n,
		kind: c,
		t: (e, t) => l(s(e), t),
		msg: O,
		msgs: (e) => e.map((e) => O(e)).join(" "),
		item: h,
		itemText: g,
		itemLabel: (e) => e.labelKey ? s(e.labelKey) : h(e.kind),
		note: (e) => {
			switch (e.kind) {
				case "parts": return e.parts.map((e) => s(`short.${e}`)).join(" + ");
				case "window": return x(e.from, e.to);
				case "swapped": return s("note.swapped");
				case "tooWindy": return s("note.tooWindy");
				case "storm": return s("note.storm");
				case "takeOff": return s("note.takeOff");
				case "putOn": return s("note.putOn");
				case "apply":
				case "reapply":
				case "applyOnce":
				case "applied": return s(`note.${e.kind}`);
			}
		},
		temp: _,
		speed: v,
		amount: y,
		hours: x,
		time: S,
		list: C,
		layers: T,
		part: (e) => s(`part.${e}`),
		uvLevel: (e) => s(e < 3 ? "uv.low" : e < 6 ? "uv.moderate" : e < 8 ? "uv.high" : e < 11 ? "uv.veryHigh" : "uv.extreme")
	};
}
//#endregion
//#region src/i18n/bag.ts
function ge(e, t) {
	let n = [];
	for (let t of e) {
		if (t.allDay) {
			let e = n.find((e) => e.key === "all");
			e ? e.kinds.push(t.kind) : n.push({
				key: "all",
				first: {
					...t,
					next: "morning"
				},
				kinds: [t.kind]
			});
			continue;
		}
		if (!t.next) continue;
		let e = t.window ? `w${t.window.from}-${t.window.to}` : `p${t.next}`, r = n.find((t) => t.key === e);
		r ? r.kinds.push(t.kind) : n.push({
			key: e,
			first: {
				...t,
				next: t.next
			},
			kinds: [t.kind]
		});
	}
	let r = n.map(({ first: e, kinds: n }) => {
		let r = t.list(n.map((e) => t.itemText(e)));
		return t.msg(e.window ? {
			key: "bring.itemWindow",
			params: {
				item: r,
				window: {
					kind: "window",
					...e.window
				}
			}
		} : {
			key: "bring.itemPart",
			params: {
				item: r,
				when: {
					kind: "parts",
					parts: [e.next],
					all: !!e.allDay
				}
			}
		}, { capitalize: !1 });
	}), i = new Intl.ListFormat(t.locale, {
		type: "unit",
		style: "short"
	}).format(r);
	return i.charAt(0).toLocaleUpperCase(t.locale) + i.slice(1);
}
function _e(e) {
	return e.bag.filter((t) => !e.out.includes(t.kind) && !e.in.includes(t.kind));
}
function B(e, t) {
	let n = (e) => t.list(e.map((e) => t.itemText(e))), r = [];
	e.out.length > 0 && r.push(t.t("bag.sayOut", { items: n(e.out) })), e.in.length > 0 && r.push(t.t("bag.sayIn", { items: n(e.in) }));
	let i = _e(e);
	return i.length > 0 && r.push(t.t("bag.sayStay", { items: n(i.map((e) => e.kind)) })), r.join(". ");
}
//#endregion
//#region src/api/openMeteo.ts
var V = "https://api.open-meteo.com/v1/forecast", ve = "https://air-quality-api.open-meteo.com/v1/air-quality", H = [
	"temperature_2m",
	"apparent_temperature",
	"precipitation_probability",
	"precipitation",
	"snowfall",
	"snow_depth",
	"wind_speed_10m",
	"wind_gusts_10m",
	"uv_index",
	"cloud_cover",
	"weather_code",
	"relative_humidity_2m",
	"sunshine_duration"
];
async function U(e, t, n) {
	let i = /* @__PURE__ */ new Map();
	try {
		let a = Object.keys(r), o = new URL(ve);
		o.searchParams.set("latitude", e.toFixed(4)), o.searchParams.set("longitude", t.toFixed(4)), o.searchParams.set("hourly", [
			"european_aqi_pm2_5",
			"european_aqi_pm10",
			...a
		].join(",")), o.searchParams.set("timezone", "auto"), o.searchParams.set("forecast_days", "2");
		let s = await fetch(o, { signal: n });
		if (!s.ok) return i;
		let c = (await s.json()).hourly;
		if (!c) return i;
		c.time.forEach((e, t) => {
			let n = [c.european_aqi_pm2_5?.[t], c.european_aqi_pm10?.[t]].filter((e) => typeof e == "number"), o = a.map((e) => c[e]?.[t]).map((e, t) => typeof e == "number" ? e / r[a[t]] : void 0).filter((e) => e !== void 0);
			i.set(e, {
				particles: n.length > 0 ? Math.max(...n) : void 0,
				pollen: o.length > 0 ? Math.max(...o) : void 0
			});
		});
	} catch (e) {
		if (n?.aborted) throw e;
	}
	return i;
}
async function W(e, t, n) {
	let r = new URL(V);
	r.searchParams.set("latitude", e.toFixed(4)), r.searchParams.set("longitude", t.toFixed(4)), r.searchParams.set("hourly", H.join(",")), r.searchParams.set("daily", "sunrise,sunset"), r.searchParams.set("current", "temperature_2m,apparent_temperature,weather_code"), r.searchParams.set("timezone", "auto"), r.searchParams.set("forecast_days", "2");
	let [i, a] = await Promise.all([fetch(r, { signal: n }), U(e, t, n)]);
	if (!i.ok) throw Error(`Forecast request failed (${i.status})`);
	return q(await i.json(), a);
}
var G = (e) => typeof e == "number" && Number.isFinite(e) ? e : 0, ye = (e) => Number(e.slice(11, 13)), K = (e) => e.slice(11, 16);
function q(e, t) {
	let n = /* @__PURE__ */ new Map();
	e.hourly.time.forEach((r, i) => {
		let a = r.slice(0, 10), o = e.hourly, s = {
			hour: ye(r),
			temp: G(o.temperature_2m[i]),
			feels: G(o.apparent_temperature[i]),
			precipProb: G(o.precipitation_probability[i]),
			precip: G(o.precipitation[i]),
			snowfall: G(o.snowfall[i]),
			snowDepth: G(o.snow_depth[i]),
			wind: G(o.wind_speed_10m[i]),
			gusts: G(o.wind_gusts_10m[i]),
			uv: G(o.uv_index[i]),
			cloud: G(o.cloud_cover[i]),
			code: G(o.weather_code[i])
		}, c = o.relative_humidity_2m?.[i];
		typeof c == "number" && (s.humidity = c);
		let l = o.sunshine_duration?.[i];
		typeof l == "number" && (s.sunshine = l / 60);
		let u = t?.get(r);
		u?.particles !== void 0 && (s.particles = u.particles), u?.pollen !== void 0 && (s.pollen = u.pollen);
		let d = n.get(a) ?? [];
		d.push(s), n.set(a, d);
	});
	let r = e.daily.time.map((t, r) => ({
		date: t,
		hours: n.get(t) ?? [],
		sunrise: K(e.daily.sunrise[r] ?? ""),
		sunset: K(e.daily.sunset[r] ?? "")
	}));
	return {
		timezone: e.timezone,
		now: e.current?.time ?? e.hourly.time[0],
		days: r,
		fetchedAt: Date.now()
	};
}
//#endregion
//#region src/lib/icons.generated.ts
var J = {
	clothing: {
		tshirt: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFD1B0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L12 14 L5 25 L13 30 L18 25 L18 55 L46 55 L46 25 L51 30 L59 25 L52 14 L42 10 C40 15 36 17 32 17 C28 17 24 15 22 10 Z\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L12 14 L5 25 L13 30 L18 25 L18 55 L46 55 L46 25 L51 30 L59 25 L52 14 L42 10 C40 15 36 17 32 17 C28 17 24 15 22 10 Z\"></path></g></svg>"
		},
		longsleeve: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#CDEBD8\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L13 14 C9 24 7 38 6 50 L14 52 L18 30 L18 55 L46 55 L46 30 L50 52 L58 50 C57 38 55 24 51 14 L42 10 C40 15 36 17 32 17 C28 17 24 15 22 10 Z\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L13 14 C9 24 7 38 6 50 L14 52 L18 30 L18 55 L46 55 L46 30 L50 52 L58 50 C57 38 55 24 51 14 L42 10 C40 15 36 17 32 17 C28 17 24 15 22 10 Z\"></path></g></svg>"
		},
		sweater: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFB77A\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L13 14 C9 24 7 38 6 50 L14 52 L18 30 L18 55 L46 55 L46 30 L50 52 L58 50 C57 38 55 24 51 14 L42 10 C40 15 36 17 32 17 C28 17 24 15 22 10 Z\"></path><path fill=\"none\" d=\"M18 49 L46 49 M7 45 L14 47 M57 45 L50 47\"></path><path fill=\"none\" d=\"M23 31 L27.5 26.5 L32 31 L36.5 26.5 L41 31\"></path><path fill=\"none\" d=\"M24 12.5 C27 19.5 37 19.5 40 12.5\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L13 14 C9 24 7 38 6 50 L14 52 L18 30 L18 55 L46 55 L46 30 L50 52 L58 50 C57 38 55 24 51 14 L42 10 C40 15 36 17 32 17 C28 17 24 15 22 10 Z\"></path><path fill=\"none\" d=\"M18 49 L46 49 M7 45 L14 47 M57 45 L50 47\"></path><path fill=\"none\" d=\"M23 31 L27.5 26.5 L32 31 L36.5 26.5 L41 31\"></path><path fill=\"none\" d=\"M24 12.5 C27 19.5 37 19.5 40 12.5\"></path></g></svg>"
		},
		jacket: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#BFE0F2\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L13 14 C9 24 7 38 6 50 L14 52 L18 30 L18 55 L46 55 L46 30 L50 52 L58 50 C57 38 55 24 51 14 L42 10 C40 15 36 17 32 17 C28 17 24 15 22 10 Z\"></path><path fill=\"none\" d=\"M32 17 L32 55\"></path><path fill=\"none\" d=\"M22 10 L27 21 L32 17 L37 21 L42 10\"></path><path fill=\"none\" d=\"M22 42 L28 42 M36 42 L42 42\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L13 14 C9 24 7 38 6 50 L14 52 L18 30 L18 55 L46 55 L46 30 L50 52 L58 50 C57 38 55 24 51 14 L42 10 C40 15 36 17 32 17 C28 17 24 15 22 10 Z\"></path><path fill=\"none\" d=\"M32 17 L32 55\"></path><path fill=\"none\" d=\"M22 10 L27 21 L32 17 L37 21 L42 10\"></path><path fill=\"none\" d=\"M22 42 L28 42 M36 42 L42 42\"></path></g></svg>"
		},
		rainjacket: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFD66B\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 17 C17 3 47 3 44 17 C40 13 24 13 20 17 Z\"></path><path d=\"M22 12 L13 15 C9 25 7 38 6 50 L14 52 L18 31 L18 56 L46 56 L46 31 L50 52 L58 50 C57 38 55 25 51 15 L42 12 C40 16 36 18 32 18 C28 18 24 16 22 12 Z\"></path><path fill=\"none\" d=\"M32 18 L32 56\"></path><path fill=\"none\" d=\"M21 40 L28 40 M36 40 L43 40\"></path><path fill=\"none\" d=\"M25 24 L25 28 M39 24 L39 28\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 17 C17 3 47 3 44 17 C40 13 24 13 20 17 Z\"></path><path d=\"M22 12 L13 15 C9 25 7 38 6 50 L14 52 L18 31 L18 56 L46 56 L46 31 L50 52 L58 50 C57 38 55 25 51 15 L42 12 C40 16 36 18 32 18 C28 18 24 16 22 12 Z\"></path><path fill=\"none\" d=\"M32 18 L32 56\"></path><path fill=\"none\" d=\"M21 40 L28 40 M36 40 L43 40\"></path><path fill=\"none\" d=\"M25 24 L25 28 M39 24 L39 28\"></path></g></svg>"
		},
		coat: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#D9D0F2\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 7 L13 11 C9 22 7 38 6 50 L14 52 L18 30 L17 60 L47 60 L46 30 L50 52 L58 50 C57 38 55 22 51 11 L42 7 C40 12 36 14 32 14 C28 14 24 12 22 7 Z\"></path><path fill=\"none\" d=\"M32 14 L32 60 M17 40 L47 40\"></path><path fill=\"none\" d=\"M21 8 C23 17 28 19 32 14 C36 19 41 17 43 8\"></path><circle cx=\"36\" cy=\"25\" r=\"1.6\" fill=\"#3D2C23\" stroke=\"none\"></circle><circle cx=\"36\" cy=\"33\" r=\"1.6\" fill=\"#3D2C23\" stroke=\"none\"></circle><circle cx=\"36\" cy=\"48\" r=\"1.6\" fill=\"#3D2C23\" stroke=\"none\"></circle></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 7 L13 11 C9 22 7 38 6 50 L14 52 L18 30 L17 60 L47 60 L46 30 L50 52 L58 50 C57 38 55 22 51 11 L42 7 C40 12 36 14 32 14 C28 14 24 12 22 7 Z\"></path><path fill=\"none\" d=\"M32 14 L32 60 M17 40 L47 40\"></path><path fill=\"none\" d=\"M21 8 C23 17 28 19 32 14 C36 19 41 17 43 8\"></path><circle cx=\"36\" cy=\"25\" r=\"1.6\" fill=\"#BCAB9B\" stroke=\"none\"></circle><circle cx=\"36\" cy=\"33\" r=\"1.6\" fill=\"#BCAB9B\" stroke=\"none\"></circle><circle cx=\"36\" cy=\"48\" r=\"1.6\" fill=\"#BCAB9B\" stroke=\"none\"></circle></g></svg>"
		},
		shorts: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFE7A0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M16 12 H48 L53 44 H36 L32 28 L28 44 H11 Z\"></path><path fill=\"none\" d=\"M16 18 H48 M32 18 V26\"></path><path fill=\"none\" d=\"M11.6 39 H28.9 M35.1 39 H52.3\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M16 12 H48 L53 44 H36 L32 28 L28 44 H11 Z\"></path><path fill=\"none\" d=\"M16 18 H48 M32 18 V26\"></path><path fill=\"none\" d=\"M11.6 39 H28.9 M35.1 39 H52.3\"></path></g></svg>"
		},
		trousers: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#C9D8F0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 7 H46 L50 58 H36 L32 25 L28 58 H14 Z\"></path><path fill=\"none\" d=\"M18 13 H46 M32 13 V22\"></path><path fill=\"none\" d=\"M21 13 C22 18 25 19.5 27 19.5 M43 13 C42 18 39 19.5 37 19.5\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 7 H46 L50 58 H36 L32 25 L28 58 H14 Z\"></path><path fill=\"none\" d=\"M18 13 H46 M32 13 V22\"></path><path fill=\"none\" d=\"M21 13 C22 18 25 19.5 27 19.5 M43 13 C42 18 39 19.5 37 19.5\"></path></g></svg>"
		},
		thermals: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F6C4D0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 7 H42 L44 58 H35 L32 24 L29 58 H20 Z\"></path><path fill=\"none\" d=\"M22 12 H42\"></path><path fill=\"none\" d=\"M20.3 52 H29.4 M34.6 52 H43.7\"></path><path fill=\"none\" stroke-width=\"1.8\" d=\"M25 20 L26 23 L27 20 M37 20 L38 23 L39 20 M24 34 L25 37 L26 34 M38 34 L39 37 L40 34\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 7 H42 L44 58 H35 L32 24 L29 58 H20 Z\"></path><path fill=\"none\" d=\"M22 12 H42\"></path><path fill=\"none\" d=\"M20.3 52 H29.4 M34.6 52 H43.7\"></path><path fill=\"none\" stroke-width=\"1.8\" d=\"M25 20 L26 23 L27 20 M37 20 L38 23 L39 20 M24 34 L25 37 L26 34 M38 34 L39 37 L40 34\"></path></g></svg>"
		},
		snowpants: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#D9D0F2\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 4 H43 V17 H21 Z\"></path><path d=\"M15 16 H49 L53 58 H37 L32 32 L27 58 H11 Z\"></path><path fill=\"none\" d=\"M15.4 22 H48.6 M13.4 45 H28.6 M35.4 45 H50.6\"></path><circle cx=\"25\" cy=\"8.5\" r=\"1.6\" fill=\"#3D2C23\" stroke=\"none\"></circle><circle cx=\"39\" cy=\"8.5\" r=\"1.6\" fill=\"#3D2C23\" stroke=\"none\"></circle></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 4 H43 V17 H21 Z\"></path><path d=\"M15 16 H49 L53 58 H37 L32 32 L27 58 H11 Z\"></path><path fill=\"none\" d=\"M15.4 22 H48.6 M13.4 45 H28.6 M35.4 45 H50.6\"></path><circle cx=\"25\" cy=\"8.5\" r=\"1.6\" fill=\"#BCAB9B\" stroke=\"none\"></circle><circle cx=\"39\" cy=\"8.5\" r=\"1.6\" fill=\"#BCAB9B\" stroke=\"none\"></circle></g></svg>"
		},
		sandals: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFE7A0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke-width=\"4\" d=\"M19 41 C21 30 31 30 34 41 M39 41 C41 33 49 33 51 41 M11 41 C11 34 15 33 18 35\"></path><path d=\"M6 45 C6 42 9 41 13 41 L55 41 C60 41 60 48 56 48 L10 48 C7 48 6 47 6 45 Z\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke-width=\"4\" d=\"M19 41 C21 30 31 30 34 41 M39 41 C41 33 49 33 51 41 M11 41 C11 34 15 33 18 35\"></path><path d=\"M6 45 C6 42 9 41 13 41 L55 41 C60 41 60 48 56 48 L10 48 C7 48 6 47 6 45 Z\"></path></g></svg>"
		},
		sneakers: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFFFFF\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 46 L6 30 C6 27 8 25 11 25 L22 25 C25 33 34 36 44 36 C53 36 58 40 58 46 L58 49 L6 49 Z\"></path><path fill=\"none\" d=\"M6 44 L58 44\"></path><path fill=\"none\" d=\"M25 30 L29 28 M29 33 L33 31 M33 35.5 L37 33.5\"></path><path fill=\"none\" d=\"M47 44 C47 40 51 38 56 40\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 46 L6 30 C6 27 8 25 11 25 L22 25 C25 33 34 36 44 36 C53 36 58 40 58 46 L58 49 L6 49 Z\"></path><path fill=\"none\" d=\"M6 44 L58 44\"></path><path fill=\"none\" d=\"M25 30 L29 28 M29 33 L33 31 M33 35.5 L37 33.5\"></path><path fill=\"none\" d=\"M47 44 C47 40 51 38 56 40\"></path></g></svg>"
		},
		rainboots: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFD66B\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 7 L37 7 L37 36 C46 36 57 39 57 49 L57 55 L17 55 Z\"></path><path fill=\"none\" d=\"M17 49 L57 49 M17 14 L37 14\"></path><path fill=\"none\" d=\"M42 20 C45 22 45 26 42 28\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 7 L37 7 L37 36 C46 36 57 39 57 49 L57 55 L17 55 Z\"></path><path fill=\"none\" d=\"M17 49 L57 49 M17 14 L37 14\"></path><path fill=\"none\" d=\"M42 20 C45 22 45 26 42 28\"></path></g></svg>"
		},
		snowboots: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#D9D0F2\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M16 18 L38 18 L38 37 C47 37 57 40 57 49 L57 56 L16 56 Z\"></path><path d=\"M13 7 L41 7 C44 7 44 18 41 18 L13 18 C10 18 10 7 13 7 Z\"></path><path fill=\"none\" d=\"M16 51 L57 51 M22 26 L32 26 M22 32 L32 32\"></path><path fill=\"none\" d=\"M18 12.5 L19 12.5 M26 12.5 L27 12.5 M34 12.5 L35 12.5\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M16 18 L38 18 L38 37 C47 37 57 40 57 49 L57 56 L16 56 Z\"></path><path d=\"M13 7 L41 7 C44 7 44 18 41 18 L13 18 C10 18 10 7 13 7 Z\"></path><path fill=\"none\" d=\"M16 51 L57 51 M22 26 L32 26 M22 32 L32 32\"></path><path fill=\"none\" d=\"M18 12.5 L19 12.5 M26 12.5 L27 12.5 M34 12.5 L35 12.5\"></path></g></svg>"
		},
		sunhat: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFE7A0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><ellipse cx=\"32\" cy=\"42\" rx=\"27\" ry=\"8\"></ellipse><path d=\"M19 42 C19 21 45 21 45 42 C38 45 26 45 19 42 Z\"></path><path fill=\"none\" d=\"M20 35 C28 37.5 36 37.5 44 35\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><ellipse cx=\"32\" cy=\"42\" rx=\"27\" ry=\"8\"></ellipse><path d=\"M19 42 C19 21 45 21 45 42 C38 45 26 45 19 42 Z\"></path><path fill=\"none\" d=\"M20 35 C28 37.5 36 37.5 44 35\"></path></g></svg>"
		},
		cap: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFB77A\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M44 39 L60 42 C62 46 52 48 44 45 Z\"></path><path d=\"M10 44 C10 26 20 19 30 19 C41 19 48 27 48 39 L48 44 Z\"></path><path fill=\"none\" d=\"M30 19 C26 27 24 35 24 44\"></path><circle cx=\"30\" cy=\"18\" r=\"2.4\"></circle></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M44 39 L60 42 C62 46 52 48 44 45 Z\"></path><path d=\"M10 44 C10 26 20 19 30 19 C41 19 48 27 48 39 L48 44 Z\"></path><path fill=\"none\" d=\"M30 19 C26 27 24 35 24 44\"></path><circle cx=\"30\" cy=\"18\" r=\"2.4\"></circle></g></svg>"
		},
		beanie: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F6C4D0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"32\" cy=\"17\" r=\"6\"></circle><path d=\"M14 44 C14 24 50 24 50 44 Z\"></path><path d=\"M11 43 L53 43 C55 43 55 54 53 54 L11 54 C9 54 9 43 11 43 Z\"></path><path fill=\"none\" d=\"M19 43 L19 54 M26 43 L26 54 M33 43 L33 54 M40 43 L40 54 M47 43 L47 54\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"32\" cy=\"17\" r=\"6\"></circle><path d=\"M14 44 C14 24 50 24 50 44 Z\"></path><path d=\"M11 43 L53 43 C55 43 55 54 53 54 L11 54 C9 54 9 43 11 43 Z\"></path><path fill=\"none\" d=\"M19 43 L19 54 M26 43 L26 54 M33 43 L33 54 M40 43 L40 54 M47 43 L47 54\"></path></g></svg>"
		},
		umbrella: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#BFE0F2\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" d=\"M32 33 L32 51 C32 57 24 57 24 51 M32 8 L32 5\"></path><path d=\"M6 33 C6 17 18 8 32 8 C46 8 58 17 58 33 C54 29 48 29 45 33 C42 29 35 29 32 33 C29 29 22 29 19 33 C16 29 10 29 6 33 Z\"></path><path fill=\"none\" d=\"M32 8 C26 16 21 24 19 33 M32 8 C38 16 43 24 45 33\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" d=\"M32 33 L32 51 C32 57 24 57 24 51 M32 8 L32 5\"></path><path d=\"M6 33 C6 17 18 8 32 8 C46 8 58 17 58 33 C54 29 48 29 45 33 C42 29 35 29 32 33 C29 29 22 29 19 33 C16 29 10 29 6 33 Z\"></path><path fill=\"none\" d=\"M32 8 C26 16 21 24 19 33 M32 8 C38 16 43 24 45 33\"></path></g></svg>"
		},
		sunglasses: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#6E5A4E\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 25 L29 25 L27 37 C26 42 12 42 10 37 Z\"></path><path d=\"M35 25 L57 25 L54 37 C53 42 39 42 37 37 Z\"></path><path fill=\"none\" d=\"M29 28 C31 25 33 25 35 28 M7 25 L3 21 M57 25 L61 21\"></path><path fill=\"none\" stroke=\"#FFFFFF\" d=\"M13 29 L17 29 M41 29 L45 29\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 25 L29 25 L27 37 C26 42 12 42 10 37 Z\"></path><path d=\"M35 25 L57 25 L54 37 C53 42 39 42 37 37 Z\"></path><path fill=\"none\" d=\"M29 28 C31 25 33 25 35 28 M7 25 L3 21 M57 25 L61 21\"></path><path fill=\"none\" stroke=\"#FFFFFF\" d=\"M13 29 L17 29 M41 29 L45 29\"></path></g></svg>"
		},
		sunscreen: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFE7A0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M26 9 L38 9 L38 21 L26 21 Z\"></path><path d=\"M20 21 L44 21 L42 56 C42 58 22 58 22 56 Z\"></path><circle cx=\"32\" cy=\"40\" r=\"5\" fill=\"none\"></circle><path fill=\"none\" d=\"M32 30.5 L32 32 M32 48 L32 49.5 M22.5 40 L24 40 M40 40 L41.5 40\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M26 9 L38 9 L38 21 L26 21 Z\"></path><path d=\"M20 21 L44 21 L42 56 C42 58 22 58 22 56 Z\"></path><circle cx=\"32\" cy=\"40\" r=\"5\" fill=\"none\"></circle><path fill=\"none\" d=\"M32 30.5 L32 32 M32 48 L32 49.5 M22.5 40 L24 40 M40 40 L41.5 40\"></path></g></svg>"
		},
		scarf: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F6C4D0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M35 30 L34 54 L46 54 L45 27 Z\"></path><path d=\"M12 17 C22 23 42 23 52 17 L52 27 C42 33 22 33 12 27 Z\"></path><path fill=\"none\" d=\"M34.5 42 L45.5 42 M34.3 48 L45.8 48 M37 54 L37 59 M40 54 L40 59 M43 54 L43 59\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M35 30 L34 54 L46 54 L45 27 Z\"></path><path d=\"M12 17 C22 23 42 23 52 17 L52 27 C42 33 22 33 12 27 Z\"></path><path fill=\"none\" d=\"M34.5 42 L45.5 42 M34.3 48 L45.8 48 M37 54 L37 59 M40 54 L40 59 M43 54 L43 59\"></path></g></svg>"
		},
		gloves: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#CDEBD8\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 33 C14 28 7 36 12 42 L22 51 Z\"></path><path d=\"M20 56 L20 30 C20 18 25 11 33 11 C41 11 45 18 45 30 L45 56 Z\"></path><path fill=\"none\" d=\"M20 47 L45 47 M26 47 L26 56 M32.5 47 L32.5 56 M39 47 L39 56\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 33 C14 28 7 36 12 42 L22 51 Z\"></path><path d=\"M20 56 L20 30 C20 18 25 11 33 11 C41 11 45 18 45 30 L45 56 Z\"></path><path fill=\"none\" d=\"M20 47 L45 47 M26 47 L26 56 M32.5 47 L32.5 56 M39 47 L39 56\"></path></g></svg>"
		},
		water: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#BFE0F2\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M27 5 H37 V12 H27 Z\"></path><path d=\"M25 12 H39 V16 C43 18 45 21 45 26 V54 C45 57 43 59 40 59 H24 C21 59 19 57 19 54 V26 C19 21 21 18 25 16 Z\"></path><path fill=\"none\" d=\"M19 33 C23.5 30 27.5 36 32 33 C36.5 30 40.5 36 45 33\"></path><path fill=\"none\" stroke=\"#FFFFFF\" d=\"M24 40 V50\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M27 5 H37 V12 H27 Z\"></path><path d=\"M25 12 H39 V16 C43 18 45 21 45 26 V54 C45 57 43 59 40 59 H24 C21 59 19 57 19 54 V26 C19 21 21 18 25 16 Z\"></path><path fill=\"none\" d=\"M19 33 C23.5 30 27.5 36 32 33 C36.5 30 40.5 36 45 33\"></path><path fill=\"none\" stroke=\"#FFFFFF\" d=\"M24 40 V50\"></path></g></svg>"
		},
		reflector: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFE35C\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" d=\"M32 22 C27 17 27 8 32 6 C37 8 37 17 32 22\"></path><path d=\"M32.0 22.0 L36.4 32.9 L48.2 33.7 L39.1 41.3 L42.0 52.8 L32.0 46.5 L22.0 52.8 L24.9 41.3 L15.8 33.7 L27.6 32.9 Z\"></path><path fill=\"none\" d=\"M53 24 L57 21 M55 38 L60 38 M11 24 L7 21 M9 38 L4 38\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" d=\"M32 22 C27 17 27 8 32 6 C37 8 37 17 32 22\"></path><path d=\"M32.0 22.0 L36.4 32.9 L48.2 33.7 L39.1 41.3 L42.0 52.8 L32.0 46.5 L22.0 52.8 L24.9 41.3 L15.8 33.7 L27.6 32.9 Z\"></path><path fill=\"none\" d=\"M53 24 L57 21 M55 38 L60 38 M11 24 L7 21 M9 38 L4 38\"></path></g></svg>"
		},
		socks: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#C9D8F0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 6 H36 V34 L48 42 C55 46 54 57 45 57 L28 55 C21 54 18 49 20 43 Z\"></path><path fill=\"none\" d=\"M20 13 H36 M20 18 H36\"></path><path fill=\"none\" d=\"M44 43.5 C40 47 41 53 46 57 M26 44 C29 48 29 52 26 55\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 6 H36 V34 L48 42 C55 46 54 57 45 57 L28 55 C21 54 18 49 20 43 Z\"></path><path fill=\"none\" d=\"M20 13 H36 M20 18 H36\"></path><path fill=\"none\" d=\"M44 43.5 C40 47 41 53 46 57 M26 44 C29 48 29 52 26 55\"></path></g></svg>"
		},
		socksShort: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFE7A0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 31 H36 V36 L48 42 C55 46 54 57 45 57 L28 55 C21 54 18 49 20 43 Z\"></path><path fill=\"none\" d=\"M20 35.5 H36\"></path><path fill=\"none\" d=\"M44 43.5 C40 47 41 53 46 57 M26 44 C29 48 29 52 26 55\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 31 H36 V36 L48 42 C55 46 54 57 45 57 L28 55 C21 54 18 49 20 43 Z\"></path><path fill=\"none\" d=\"M20 35.5 H36\"></path><path fill=\"none\" d=\"M44 43.5 C40 47 41 53 46 57 M26 44 C29 48 29 52 26 55\"></path></g></svg>"
		},
		socksEveryday: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#CDEBD8\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 14 H36 V34 L48 42 C55 46 54 57 45 57 L28 55 C21 54 18 49 20 43 Z\"></path><path fill=\"none\" d=\"M20 20 H36\"></path><path fill=\"none\" d=\"M44 43.5 C40 47 41 53 46 57 M26 44 C29 48 29 52 26 55\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 14 H36 V34 L48 42 C55 46 54 57 45 57 L28 55 C21 54 18 49 20 43 Z\"></path><path fill=\"none\" d=\"M20 20 H36\"></path><path fill=\"none\" d=\"M44 43.5 C40 47 41 53 46 57 M26 44 C29 48 29 52 26 55\"></path></g></svg>"
		},
		socksWool: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFB77A\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 10 H38 V33 L49 41 C57 46 56 58 46 58 L28 56 C20 55 16 49 18 42 Z\"></path><path fill=\"none\" d=\"M18 18 H38 M22.5 10 V18 M27.5 10 V18 M32.5 10 V18\"></path><path fill=\"none\" d=\"M21 25 L24.5 29 L28 25 L31.5 29 L35 25 M21 31.5 L24.5 35.5 L28 31.5\"></path><path fill=\"none\" d=\"M45 43 C40.5 47 41.5 53.5 47 58 M25.5 43.5 C29 48 29 52.5 25.5 56\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 10 H38 V33 L49 41 C57 46 56 58 46 58 L28 56 C20 55 16 49 18 42 Z\"></path><path fill=\"none\" d=\"M18 18 H38 M22.5 10 V18 M27.5 10 V18 M32.5 10 V18\"></path><path fill=\"none\" d=\"M21 25 L24.5 29 L28 25 L31.5 29 L35 25 M21 31.5 L24.5 35.5 L28 31.5\"></path><path fill=\"none\" d=\"M45 43 C40.5 47 41.5 53.5 47 58 M25.5 43.5 C29 48 29 52.5 25.5 56\"></path></g></svg>"
		},
		socksThermal: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#D9D0F2\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 3 H37 V35 L48 42 C55 46 54 57 45 57 L28 55 C21 54 18 49 20 43 L21 35 Z\"></path><path fill=\"none\" d=\"M21 9 H37 M25 3 V9 M29 3 V9 M33 3 V9\"></path><path fill=\"none\" d=\"M29 16 V28 M23.8 19 L34.2 25 M23.8 25 L34.2 19\"></path><path fill=\"none\" d=\"M44 43.5 C40 47 41 53 46 57 M26 44 C29 48 29 52 26 55\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 3 H37 V35 L48 42 C55 46 54 57 45 57 L28 55 C21 54 18 49 20 43 L21 35 Z\"></path><path fill=\"none\" d=\"M21 9 H37 M25 3 V9 M29 3 V9 M33 3 V9\"></path><path fill=\"none\" d=\"M29 16 V28 M23.8 19 L34.2 25 M23.8 25 L34.2 19\"></path><path fill=\"none\" d=\"M44 43.5 C40 47 41 53 46 57 M26 44 C29 48 29 52 26 55\"></path></g></svg>"
		},
		poncho: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFD66B\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M23 18 L8 48 C7 52 10 55 14 55 L50 55 C54 55 57 52 56 48 L41 18 Z\"></path><path d=\"M22 20 C18 6 46 6 42 20 C38 15 26 15 22 20 Z\"></path><path fill=\"none\" d=\"M24.5 19.5 C27 25 37 25 39.5 19.5\"></path><path fill=\"none\" d=\"M29 25 L28 31 M35 25 L36 31\"></path><path fill=\"none\" d=\"M21 46 L43 46\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M23 18 L8 48 C7 52 10 55 14 55 L50 55 C54 55 57 52 56 48 L41 18 Z\"></path><path d=\"M22 20 C18 6 46 6 42 20 C38 15 26 15 22 20 Z\"></path><path fill=\"none\" d=\"M24.5 19.5 C27 25 37 25 39.5 19.5\"></path><path fill=\"none\" d=\"M29 25 L28 31 M35 25 L36 31\"></path><path fill=\"none\" d=\"M21 46 L43 46\"></path></g></svg>"
		},
		lipbalm: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F6C4D0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M26 24 V13 C26 9 33 6 38 10 V24 Z\"></path><path d=\"M22 24 H42 V30 H22 Z\"></path><path d=\"M24 30 H40 V55 C40 57.5 24 57.5 24 55 Z\"></path><path fill=\"none\" d=\"M24 38 H40\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M26 24 V13 C26 9 33 6 38 10 V24 Z\"></path><path d=\"M22 24 H42 V30 H22 Z\"></path><path d=\"M24 30 H40 V55 C40 57.5 24 57.5 24 55 Z\"></path><path fill=\"none\" d=\"M24 38 H40\"></path></g></svg>"
		},
		handwarmers: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFB77A\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 27 H49 C52 27 53 28 53 31 V52 C53 55 52 56 49 56 H15 C12 56 11 55 11 52 V31 C11 28 12 27 15 27 Z\"></path><path fill=\"none\" d=\"M17 33 H47 V50 H17 Z\" stroke-dasharray=\"3 4\"></path><path fill=\"none\" d=\"M22 21 C19 17 25 14 22 9 M32 21 C29 17 35 14 32 9 M42 21 C39 17 45 14 42 9\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 27 H49 C52 27 53 28 53 31 V52 C53 55 52 56 49 56 H15 C12 56 11 55 11 52 V31 C11 28 12 27 15 27 Z\"></path><path fill=\"none\" d=\"M17 33 H47 V50 H17 Z\" stroke-dasharray=\"3 4\"></path><path fill=\"none\" d=\"M22 21 C19 17 25 14 22 9 M32 21 C29 17 35 14 32 9 M42 21 C39 17 45 14 42 9\"></path></g></svg>"
		},
		fan: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#D9D0F2\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M32 54 L7 27 C15 11 49 11 57 27 Z\"></path><path fill=\"none\" d=\"M32 54 L15 19.5 M32 54 L23 15 M32 54 V13.5 M32 54 L41 15 M32 54 L49 19.5\"></path><circle cx=\"32\" cy=\"54\" r=\"3\" fill=\"#3D2C23\"></circle></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M32 54 L7 27 C15 11 49 11 57 27 Z\"></path><path fill=\"none\" d=\"M32 54 L15 19.5 M32 54 L23 15 M32 54 V13.5 M32 54 L41 15 M32 54 L49 19.5\"></path><circle cx=\"32\" cy=\"54\" r=\"3\" fill=\"#BCAB9B\"></circle></g></svg>"
		},
		repellent: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#CDEBD8\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M25 13 H35 V23 H25 Z\"></path><path fill=\"none\" d=\"M35 16 H40\"></path><path d=\"M21 23 H39 V55 C39 58 21 58 21 55 Z\"></path><circle cx=\"30\" cy=\"40\" r=\"5.5\" fill=\"#FFFFFF\"></circle><path fill=\"none\" d=\"M26.5 36.5 L33.5 43.5 M33.5 36.5 L26.5 43.5\"></path><path fill=\"none\" d=\"M46 12 L46 12.1 M50 16 L50 16.1 M46 20 L46 20.1 M53 11 L53 11.1 M54 20 L54 20.1\" stroke-width=\"3.5\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M25 13 H35 V23 H25 Z\"></path><path fill=\"none\" d=\"M35 16 H40\"></path><path d=\"M21 23 H39 V55 C39 58 21 58 21 55 Z\"></path><circle cx=\"30\" cy=\"40\" r=\"5.5\" fill=\"#FFFFFF\"></circle><path fill=\"none\" d=\"M26.5 36.5 L33.5 43.5 M33.5 36.5 L26.5 43.5\"></path><path fill=\"none\" d=\"M46 12 L46 12.1 M50 16 L50 16.1 M46 20 L46 20.1 M53 11 L53 11.1 M54 20 L54 20.1\" stroke-width=\"3.5\"></path></g></svg>"
		},
		mask: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#BFE0F2\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" d=\"M15 26 C5 25 5 41 15 40 M49 26 C59 25 59 41 49 40\"></path><path d=\"M15 23 C25 18 39 18 49 23 L49 40 C40 49 24 49 15 40 Z\"></path><path fill=\"none\" d=\"M18 29 H46 M18 35 H46\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" d=\"M15 26 C5 25 5 41 15 40 M49 26 C59 25 59 41 49 40\"></path><path d=\"M15 23 C25 18 39 18 49 23 L49 40 C40 49 24 49 15 40 Z\"></path><path fill=\"none\" d=\"M18 29 H46 M18 35 H46\"></path></g></svg>"
		},
		tissues: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFE7A0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M26 31 C22 22 25 12 33 7 C35 15 42 19 40 31 Z\"></path><path d=\"M10 30 H54 V55 H10 Z\"></path><path fill=\"none\" d=\"M24 30 C26 35 38 35 40 30\"></path><path fill=\"none\" d=\"M10 38 H54\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M26 31 C22 22 25 12 33 7 C35 15 42 19 40 31 Z\"></path><path d=\"M10 30 H54 V55 H10 Z\"></path><path fill=\"none\" d=\"M24 30 C26 35 38 35 40 30\"></path><path fill=\"none\" d=\"M10 38 H54\"></path></g></svg>"
		},
		top: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F6C4D0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L14 13 L9 21 L16 25 L19 22 L18 54 L46 54 L45 22 L48 25 L55 21 L50 13 L42 10 C40 17 36 20 32 20 C28 20 24 17 22 10 Z\"></path><path fill=\"none\" d=\"M18 47 C21 50 24 50 27 47 C30 50 34 50 37 47 C40 50 43 50 46 47\"></path><path fill=\"none\" d=\"M29 26 L32 29 L35 26 M32 29 V31\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L14 13 L9 21 L16 25 L19 22 L18 54 L46 54 L45 22 L48 25 L55 21 L50 13 L42 10 C40 17 36 20 32 20 C28 20 24 17 22 10 Z\"></path><path fill=\"none\" d=\"M18 47 C21 50 24 50 27 47 C30 50 34 50 37 47 C40 50 43 50 46 47\"></path><path fill=\"none\" d=\"M29 26 L32 29 L35 26 M32 29 V31\"></path></g></svg>"
		},
		hoodie: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFB77A\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 14 C18 2 46 2 43 14 C39 10 25 10 21 14 Z\"></path><path d=\"M22 10 L13 14 C9 24 7 38 6 50 L14 52 L18 30 L18 55 L46 55 L46 30 L50 52 L58 50 C57 38 55 24 51 14 L42 10 C40 15 36 17 32 17 C28 17 24 15 22 10 Z\"></path><path fill=\"none\" d=\"M23 12.5 C26 19 38 19 41 12.5\"></path><path fill=\"none\" d=\"M29 18 V26 M35 18 V26\"></path><path fill=\"none\" d=\"M22 50 L24 40 H40 L42 50\"></path><path fill=\"none\" d=\"M7 45 L14 47 M57 45 L50 47\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 14 C18 2 46 2 43 14 C39 10 25 10 21 14 Z\"></path><path d=\"M22 10 L13 14 C9 24 7 38 6 50 L14 52 L18 30 L18 55 L46 55 L46 30 L50 52 L58 50 C57 38 55 24 51 14 L42 10 C40 15 36 17 32 17 C28 17 24 15 22 10 Z\"></path><path fill=\"none\" d=\"M23 12.5 C26 19 38 19 41 12.5\"></path><path fill=\"none\" d=\"M29 18 V26 M35 18 V26\"></path><path fill=\"none\" d=\"M22 50 L24 40 H40 L42 50\"></path><path fill=\"none\" d=\"M7 45 L14 47 M57 45 L50 47\"></path></g></svg>"
		},
		skirt: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFE7A0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 18 H44 L54 50 C46 54 18 54 10 50 Z\"></path><path d=\"M20 11 H44 V18 H20 Z\"></path><path fill=\"none\" d=\"M26 18 L22 51.5 M32 18 V52.5 M38 18 L42 51.5\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 18 H44 L54 50 C46 54 18 54 10 50 Z\"></path><path d=\"M20 11 H44 V18 H20 Z\"></path><path fill=\"none\" d=\"M26 18 L22 51.5 M32 18 V52.5 M38 18 L42 51.5\"></path></g></svg>"
		},
		cardigan: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#EBCBEF\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L13 14 C9 24 7 38 6 50 L14 52 L18 30 L18 55 L46 55 L46 30 L50 52 L58 50 C57 38 55 24 51 14 L42 10 C40 15 36 17 32 17 C28 17 24 15 22 10 Z\"></path><path fill=\"none\" d=\"M23 11 L32 29 L41 11 M32 29 V55\"></path><path fill=\"none\" d=\"M18 49 L46 49 M7 45 L14 47 M57 45 L50 47\"></path><circle cx=\"34.8\" cy=\"35\" r=\"1.5\" fill=\"#3D2C23\" stroke=\"none\"></circle><circle cx=\"34.8\" cy=\"42\" r=\"1.5\" fill=\"#3D2C23\" stroke=\"none\"></circle></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L13 14 C9 24 7 38 6 50 L14 52 L18 30 L18 55 L46 55 L46 30 L50 52 L58 50 C57 38 55 24 51 14 L42 10 C40 15 36 17 32 17 C28 17 24 15 22 10 Z\"></path><path fill=\"none\" d=\"M23 11 L32 29 L41 11 M32 29 V55\"></path><path fill=\"none\" d=\"M18 49 L46 49 M7 45 L14 47 M57 45 L50 47\"></path><circle cx=\"34.8\" cy=\"35\" r=\"1.5\" fill=\"#BCAB9B\" stroke=\"none\"></circle><circle cx=\"34.8\" cy=\"42\" r=\"1.5\" fill=\"#BCAB9B\" stroke=\"none\"></circle></g></svg>"
		},
		tights: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#D9D0F2\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 7 H42 L43 49 L46 55 C47 59 36 60 35 56 L34 49 L32 24 L30 49 L29 56 C28 60 17 59 18 55 L21 49 Z\"></path><path fill=\"none\" d=\"M22 12 H42\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 7 H42 L43 49 L46 55 C47 59 36 60 35 56 L34 49 L32 24 L30 49 L29 56 C28 60 17 59 18 55 L21 49 Z\"></path><path fill=\"none\" d=\"M22 12 H42\"></path></g></svg>"
		},
		hikingBoots: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#C9A27E\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 6 H36 L37 30 C46 31 56 35 56 45 L56 50 H14 L16 30 Z\"></path><path d=\"M13 50 H57 L56 57 H14 Z\" fill=\"#8A6B52\"></path><path fill=\"none\" d=\"M22 13 H32 M22 19 H32 M22 25 H33\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 6 H36 L37 30 C46 31 56 35 56 45 L56 50 H14 L16 30 Z\"></path><path d=\"M13 50 H57 L56 57 H14 Z\" fill=\"#8A6B52\"></path><path fill=\"none\" d=\"M22 13 H32 M22 19 H32 M22 25 H33\"></path></g></svg>"
		},
		swimwear: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#7EBEE6\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14 12 H50 L54 46 H36 L32 30 L28 46 H10 Z\"></path><path fill=\"none\" d=\"M14 18 H50 M30 18 L28 24 M34 18 L36 24 M11.6 40 H28.9 M35.1 40 H52.3\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14 12 H50 L54 46 H36 L32 30 L28 46 H10 Z\"></path><path fill=\"none\" d=\"M14 18 H50 M30 18 L28 24 M34 18 L36 24 M11.6 40 H28.9 M35.1 40 H52.3\"></path></g></svg>"
		},
		swimsuit: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#7EBEE6\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 8 L27 20 C29 24 35 24 37 20 L42 8 L46 10 C44 20 44 26 46 32 C48 40 45 49 41 56 H23 C19 49 16 40 18 32 C20 26 20 20 18 10 Z\"></path><path fill=\"none\" d=\"M20 38 C26 42 38 42 44 38\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 8 L27 20 C29 24 35 24 37 20 L42 8 L46 10 C44 20 44 26 46 32 C48 40 45 49 41 56 H23 C19 49 16 40 18 32 C20 26 20 20 18 10 Z\"></path><path fill=\"none\" d=\"M20 38 C26 42 38 42 44 38\"></path></g></svg>"
		},
		flipflops: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFE7A0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 8 C9 8 9 22 11 34 C12 45 13 56 19 56 C25 56 26 45 26 34 C27 22 25 8 17 8 Z\"></path><path d=\"M45 8 C37 8 37 22 39 34 C40 45 41 56 47 56 C53 56 54 45 54 34 C55 22 53 8 45 8 Z\"></path><path fill=\"none\" d=\"M18 16 L12 28 M18 16 L25 28 M46 16 L40 28 M46 16 L53 28\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 8 C9 8 9 22 11 34 C12 45 13 56 19 56 C25 56 26 45 26 34 C27 22 25 8 17 8 Z\"></path><path d=\"M45 8 C37 8 37 22 39 34 C40 45 41 56 47 56 C53 56 54 45 54 34 C55 22 53 8 45 8 Z\"></path><path fill=\"none\" d=\"M18 16 L12 28 M18 16 L25 28 M46 16 L40 28 M46 16 L53 28\"></path></g></svg>"
		},
		goggles: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#B8A2F5\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke-width=\"3\" d=\"M3 31 H8 M56 31 H61\"></path><path d=\"M12 22 H52 C56 22 58 26 58 31 C58 38 54 42 48 42 C42 42 38 37 32 37 C26 37 22 42 16 42 C10 42 6 38 6 31 C6 26 8 22 12 22 Z\"></path><path fill=\"none\" stroke=\"#FFFFFF\" d=\"M14 28 L20 28\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke-width=\"3\" d=\"M3 31 H8 M56 31 H61\"></path><path d=\"M12 22 H52 C56 22 58 26 58 31 C58 38 54 42 48 42 C42 42 38 37 32 37 C26 37 22 42 16 42 C10 42 6 38 6 31 C6 26 8 22 12 22 Z\"></path><path fill=\"none\" stroke=\"#FFFFFF\" d=\"M14 28 L20 28\"></path></g></svg>"
		},
		smartOutfit: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFFFFF\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L13 14 C9 24 7 38 6 50 L14 52 L18 30 L18 56 L46 56 L46 30 L50 52 L58 50 C57 38 55 24 51 14 L42 10 L32 16 Z\"></path><path fill=\"none\" d=\"M22 10 L28 20 L32 16 L36 20 L42 10\"></path><path d=\"M32 18 L29 22 L31 40 L32 43 L33 40 L35 22 Z\" fill=\"#9573E6\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L13 14 C9 24 7 38 6 50 L14 52 L18 30 L18 56 L46 56 L46 30 L50 52 L58 50 C57 38 55 24 51 14 L42 10 L32 16 Z\"></path><path fill=\"none\" d=\"M22 10 L28 20 L32 16 L36 20 L42 10\"></path><path d=\"M32 18 L29 22 L31 40 L32 43 L33 40 L35 22 Z\" fill=\"#9573E6\"></path></g></svg>"
		},
		dress: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#EBCBEF\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M24 6 L26 16 C27 20 37 20 38 16 L40 6 L44 8 L42 22 C41 26 41 28 42 30 L52 56 H12 L22 30 C23 28 23 26 22 22 L20 8 Z\"></path><path fill=\"none\" d=\"M22 30 C28 33 36 33 42 30\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M24 6 L26 16 C27 20 37 20 38 16 L40 6 L44 8 L42 22 C41 26 41 28 42 30 L52 56 H12 L22 30 C23 28 23 26 22 22 L20 8 Z\"></path><path fill=\"none\" d=\"M22 30 C28 33 36 33 42 30\"></path></g></svg>"
		},
		smartShoes: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#6E5A4E\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 44 L6 34 C6 31 8 29 11 29 L24 29 C28 34 36 36 46 37 C54 38 58 41 58 46 L58 48 L6 48 Z\"></path><path fill=\"none\" d=\"M6 44 H58\"></path><path fill=\"none\" stroke=\"#FFFFFF\" d=\"M26 33 L30 31\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 44 L6 34 C6 31 8 29 11 29 L24 29 C28 34 36 36 46 37 C54 38 58 41 58 46 L58 48 L6 48 Z\"></path><path fill=\"none\" d=\"M6 44 H58\"></path><path fill=\"none\" stroke=\"#FFFFFF\" d=\"M26 33 L30 31\"></path></g></svg>"
		},
		sportswear: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#CDEBD8\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L12 14 L5 25 L13 30 L18 25 L18 55 L46 55 L46 25 L51 30 L59 25 L52 14 L42 10 C40 15 36 17 32 17 C28 17 24 15 22 10 Z\"></path><path fill=\"none\" d=\"M21 25 V55 M43 25 V55\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L12 14 L5 25 L13 30 L18 25 L18 55 L46 55 L46 25 L51 30 L59 25 L52 14 L42 10 C40 15 36 17 32 17 C28 17 24 15 22 10 Z\"></path><path fill=\"none\" d=\"M21 25 V55 M43 25 V55\"></path></g></svg>"
		},
		runningShoes: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#BFE0F2\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 46 L6 30 C6 27 8 25 11 25 L22 25 C25 33 34 36 44 36 C53 36 58 40 58 46 L58 49 L6 49 Z\"></path><path fill=\"none\" d=\"M6 44 L58 44\"></path><path fill=\"none\" d=\"M13 38 C24 42 36 40 47 37\"></path><path fill=\"none\" d=\"M25 30 L29 28 M29 33 L33 31\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 46 L6 30 C6 27 8 25 11 25 L22 25 C25 33 34 36 44 36 C53 36 58 40 58 46 L58 49 L6 49 Z\"></path><path fill=\"none\" d=\"M6 44 L58 44\"></path><path fill=\"none\" d=\"M13 38 C24 42 36 40 47 37\"></path><path fill=\"none\" d=\"M25 30 L29 28 M29 33 L33 31\"></path></g></svg>"
		},
		dayBag: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFB77A\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" d=\"M24 14 V10 A8 8 0 0 1 40 10 V14\"></path><path d=\"M16 22 A8 8 0 0 1 24 14 H40 A8 8 0 0 1 48 22 V52 A4 4 0 0 1 44 56 H20 A4 4 0 0 1 16 52 Z\"></path><path d=\"M24 38 H40 V50 H24 Z\"></path><path fill=\"none\" d=\"M24 30 H40\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" d=\"M24 14 V10 A8 8 0 0 1 40 10 V14\"></path><path d=\"M16 22 A8 8 0 0 1 24 14 H40 A8 8 0 0 1 48 22 V52 A4 4 0 0 1 44 56 H20 A4 4 0 0 1 16 52 Z\"></path><path d=\"M24 38 H40 V50 H24 Z\"></path><path fill=\"none\" d=\"M24 30 H40\"></path></g></svg>"
		},
		towel: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F6C4D0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 10 H52 V50 H12 Z\"></path><path fill=\"none\" d=\"M12 20 H52 M12 40 H52\"></path><path fill=\"none\" d=\"M17 50 V56 M23 50 V56 M29 50 V56 M35 50 V56 M41 50 V56 M47 50 V56\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 10 H52 V50 H12 Z\"></path><path fill=\"none\" d=\"M12 20 H52 M12 40 H52\"></path><path fill=\"none\" d=\"M17 50 V56 M23 50 V56 M29 50 V56 M35 50 V56 M41 50 V56 M47 50 V56\"></path></g></svg>"
		},
		skiJacket: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#9DCBEA\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 17 C17 3 47 3 44 17 C40 13 24 13 20 17 Z\"></path><path d=\"M22 12 L13 15 C9 25 7 38 6 50 L14 52 L18 31 L18 56 L46 56 L46 31 L50 52 L58 50 C57 38 55 25 51 15 L42 12 C40 16 36 18 32 18 C28 18 24 16 22 12 Z\"></path><path fill=\"none\" d=\"M32 18 L32 56 M18 34 H46\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 17 C17 3 47 3 44 17 C40 13 24 13 20 17 Z\"></path><path d=\"M22 12 L13 15 C9 25 7 38 6 50 L14 52 L18 31 L18 56 L46 56 L46 31 L50 52 L58 50 C57 38 55 25 51 15 L42 12 C40 16 36 18 32 18 C28 18 24 16 22 12 Z\"></path><path fill=\"none\" d=\"M32 18 L32 56 M18 34 H46\"></path></g></svg>"
		},
		skiPants: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#9DCBEA\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 6 H47 L50 58 H36 L32 26 L28 58 H14 Z\"></path><path fill=\"none\" d=\"M17 12 H47 M20 12 V20 H44 V12\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 6 H47 L50 58 H36 L32 26 L28 58 H14 Z\"></path><path fill=\"none\" d=\"M17 12 H47 M20 12 V20 H44 V12\"></path></g></svg>"
		},
		fleece: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#D9D0F2\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L13 14 C9 24 7 38 6 50 L14 52 L18 30 L18 55 L46 55 L46 30 L50 52 L58 50 C57 38 55 24 51 14 L42 10 C40 15 36 17 32 17 C28 17 24 15 22 10 Z\"></path><path fill=\"none\" d=\"M26 12 L32 17 L38 12 M32 17 V44\"></path><path fill=\"none\" d=\"M18 49 L46 49\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10 L13 14 C9 24 7 38 6 50 L14 52 L18 30 L18 55 L46 55 L46 30 L50 52 L58 50 C57 38 55 24 51 14 L42 10 C40 15 36 17 32 17 C28 17 24 15 22 10 Z\"></path><path fill=\"none\" d=\"M26 12 L32 17 L38 12 M32 17 V44\"></path><path fill=\"none\" d=\"M18 49 L46 49\"></path></g></svg>"
		},
		headTorch: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFE7A0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><ellipse cx=\"32\" cy=\"38\" rx=\"22\" ry=\"10\" fill=\"none\" stroke-width=\"4\" stroke=\"#BFE0F2\"></ellipse><ellipse cx=\"32\" cy=\"38\" rx=\"22\" ry=\"10\" fill=\"none\"></ellipse><rect x=\"23\" y=\"30\" width=\"18\" height=\"15\" rx=\"4\"></rect><circle cx=\"32\" cy=\"37.5\" r=\"4\" fill=\"#FFFFFF\"></circle><path fill=\"none\" d=\"M32 26 V16 M22 27 L16 20 M42 27 L48 20\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><ellipse cx=\"32\" cy=\"38\" rx=\"22\" ry=\"10\" fill=\"none\" stroke-width=\"4\" stroke=\"#BFE0F2\"></ellipse><ellipse cx=\"32\" cy=\"38\" rx=\"22\" ry=\"10\" fill=\"none\"></ellipse><rect x=\"23\" y=\"30\" width=\"18\" height=\"15\" rx=\"4\"></rect><circle cx=\"32\" cy=\"37.5\" r=\"4\" fill=\"#FFFFFF\"></circle><path fill=\"none\" d=\"M32 26 V16 M22 27 L16 20 M42 27 L48 20\"></path></g></svg>"
		},
		cyclingShorts: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#C9D8F0\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M16 14 H48 L51 40 H35 L32 28 L29 40 H13 Z\"></path><path fill=\"none\" d=\"M16 20 H48 M13.6 35 H29.8 M34.2 35 H50.4\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M16 14 H48 L51 40 H35 L32 28 L29 40 H13 Z\"></path><path fill=\"none\" d=\"M16 20 H48 M13.6 35 H29.8 M34.2 35 H50.4\"></path></g></svg>"
		},
		bikeLight: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFD66B\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"8\" y=\"25\" width=\"26\" height=\"14\" rx=\"7\"></rect><path d=\"M34 23 L40 21 V43 L34 41 Z\" fill=\"#FFFFFF\"></path><path fill=\"none\" d=\"M46 25 L57 20 M46 32 H59 M46 39 L57 44 M15 39 V45 M27 39 V45\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"8\" y=\"25\" width=\"26\" height=\"14\" rx=\"7\"></rect><path d=\"M34 23 L40 21 V43 L34 41 Z\" fill=\"#FFFFFF\"></path><path fill=\"none\" d=\"M46 25 L57 20 M46 32 H59 M46 39 L57 44 M15 39 V45 M27 39 V45\"></path></g></svg>"
		},
		helmet: {
			on: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#FFB77A\" stroke=\"#3D2C23\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 40 C8 24 20 14 34 14 C48 14 58 24 58 38 L58 42 H8 Z\"></path><path fill=\"none\" d=\"M22 18 L26 30 M34 14 V30 M46 18 L42 30\"></path><path fill=\"none\" d=\"M14 42 L20 50 H32\"></path></g></svg>",
			off: "<svg class=\"art\" viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"#F3ECE4\" stroke=\"#BCAB9B\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 40 C8 24 20 14 34 14 C48 14 58 24 58 38 L58 42 H8 Z\"></path><path fill=\"none\" d=\"M22 18 L26 30 M34 14 V30 M46 18 L42 30\"></path><path fill=\"none\" d=\"M14 42 L20 50 H32\"></path></g></svg>"
		}
	},
	weather: {
		sun: "<svg class=\"wx\" viewBox=\"0 0 40 40\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#3D2C23\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path class=\"wx__rays\" fill=\"none\" d=\"M20 5 V8 M20 32 V35 M5 20 H8 M32 20 H35 M9.4 9.4 L11.5 11.5 M28.5 28.5 L30.6 30.6 M9.4 30.6 L11.5 28.5 M28.5 11.5 L30.6 9.4\"></path><circle class=\"wx__core\" cx=\"20\" cy=\"20\" r=\"8\" fill=\"#FFE7A0\"></circle></g></svg>",
		partly: "<svg class=\"wx\" viewBox=\"0 0 40 40\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#3D2C23\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle class=\"wx__peek\" cx=\"15\" cy=\"14\" r=\"7\" fill=\"#FFE7A0\"></circle><path class=\"wx__drift\" d=\"M12 32 H29 A6 6 0 0 0 29 20 A8 8 0 0 0 15 18 A7 7 0 0 0 12 32 Z\" fill=\"#FFFFFF\"></path></g></svg>",
		cloud: "<svg class=\"wx\" viewBox=\"0 0 40 40\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#3D2C23\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path class=\"wx__drift\" d=\"M9 30 H30 A7 7 0 0 0 30 16 A9 9 0 0 0 13 14 A8 8 0 0 0 9 30 Z\" fill=\"#FFFFFF\"></path></g></svg>",
		fog: "<svg class=\"wx\" viewBox=\"0 0 40 40\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#3D2C23\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path class=\"wx__drift wx__drift--slow\" d=\"M10 26 H28 A6 6 0 0 0 28 14 A8 8 0 0 0 13 12 A7 7 0 0 0 10 26 Z\" fill=\"#FFFFFF\"></path><path class=\"wx__fog\" fill=\"none\" d=\"M8 31 H32\"></path><path class=\"wx__fog wx__fog--2\" fill=\"none\" d=\"M12 36 H28\"></path></g></svg>",
		rain: "<svg class=\"wx\" viewBox=\"0 0 40 40\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#3D2C23\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path class=\"wx__drift\" d=\"M10 26 H28 A6 6 0 0 0 28 14 A8 8 0 0 0 13 12 A7 7 0 0 0 10 26 Z\" fill=\"#BFE0F2\"></path><g fill=\"none\" stroke=\"#3A8BB8\"><path class=\"wx__drop\" d=\"M14 31 L12 36\"></path><path class=\"wx__drop\" d=\"M21 31 L19 36\"></path><path class=\"wx__drop\" d=\"M28 31 L26 36\"></path></g></g></svg>",
		snow: "<svg class=\"wx\" viewBox=\"0 0 40 40\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#3D2C23\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path class=\"wx__drift wx__drift--slow\" d=\"M10 26 H28 A6 6 0 0 0 28 14 A8 8 0 0 0 13 12 A7 7 0 0 0 10 26 Z\" fill=\"#FFFFFF\"></path><g fill=\"none\" stroke=\"#6C8FB0\"><path class=\"wx__flake\" d=\"M13 31 V35 M11 33 H15\"></path><path class=\"wx__flake\" d=\"M20 32 V36 M18 34 H22\"></path><path class=\"wx__flake\" d=\"M27 31 V35 M25 33 H29\"></path></g></g></svg>",
		storm: "<svg class=\"wx\" viewBox=\"0 0 40 40\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#3D2C23\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path class=\"wx__drift\" d=\"M10 26 H28 A6 6 0 0 0 28 14 A8 8 0 0 0 13 12 A7 7 0 0 0 10 26 Z\" fill=\"#D9D0F2\"></path><path class=\"wx__bolt\" d=\"M21 27 L16 34 H21 L18 39 L26 31 H21 L24 27 Z\" fill=\"#FFD66B\"></path></g></svg>",
		moon: "<svg class=\"wx\" viewBox=\"0 0 40 40\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#3D2C23\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path class=\"wx__moon\" d=\"M22 7 A13 13 0 1 0 33 23 A10 10 0 0 1 22 7 Z\" fill=\"#D9D0F2\"></path></g></svg>",
		moonCloud: "<svg class=\"wx\" viewBox=\"0 0 40 40\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#3D2C23\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path class=\"wx__moon\" d=\"M20 5 A11 11 0 1 0 32 19 A8 8 0 0 1 20 5 Z\" fill=\"#D9D0F2\"></path><path class=\"wx__drift\" d=\"M12 34 H27 A5 5 0 0 0 27 24 A7 7 0 0 0 14 22.5 A6 6 0 0 0 12 34 Z\" fill=\"#FFFFFF\"></path></g></svg>"
	},
	face: {
		good: "<svg class=\"art\" viewBox=\"0 0 48 48\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#291D18\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"24\" cy=\"25\" r=\"18\" fill=\"#FFE3C2\"></circle><path fill=\"none\" d=\"M16 30 Q24 37 32 30\"></path><circle cx=\"18\" cy=\"21\" r=\"1.2\" fill=\"#291D18\"></circle><circle cx=\"30\" cy=\"21\" r=\"1.2\" fill=\"#291D18\"></circle></g></svg>",
		meh: "<svg class=\"art\" viewBox=\"0 0 48 48\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#291D18\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"24\" cy=\"25\" r=\"18\" fill=\"#D9D0F2\"></circle><path fill=\"none\" d=\"M17 33 Q24 28 31 33\"></path><circle cx=\"18\" cy=\"21\" r=\"1.2\" fill=\"#291D18\"></circle><circle cx=\"30\" cy=\"21\" r=\"1.2\" fill=\"#291D18\"></circle></g></svg>",
		cold: "<svg class=\"art\" viewBox=\"0 0 48 48\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#291D18\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"24\" cy=\"25\" r=\"18\" fill=\"#C8EAFA\"></circle><path fill=\"none\" d=\"M2.5 19 L5 21 M2.5 29 L5 27 M45.5 19 L43 21 M45.5 29 L43 27\"></path><path fill=\"none\" d=\"M15 33 L18 30 L21 33 L24 30 L27 33 L30 30 L33 33\"></path><path fill=\"none\" d=\"M15 20 L19 22 M33 20 L29 22\"></path></g></svg>",
		hot: "<svg class=\"art\" viewBox=\"0 0 48 48\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#291D18\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"24\" cy=\"25\" r=\"18\" fill=\"#FCB679\"></circle><path d=\"M40 4 C40 4 36 9.5 36 12 A4 4 0 0 0 44 12 C44 9.5 40 4 40 4 Z\" fill=\"#C8EAFA\"></path><ellipse cx=\"24\" cy=\"32\" rx=\"4\" ry=\"3\" fill=\"#291D18\"></ellipse><circle cx=\"18\" cy=\"21\" r=\"1.2\" fill=\"#291D18\"></circle><circle cx=\"30\" cy=\"21\" r=\"1.2\" fill=\"#291D18\"></circle></g></svg>"
	},
	ui: {
		pin: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 21 C12 21 5 14.5 5 9.5 A7 7 0 0 1 19 9.5 C19 14.5 12 21 12 21 Z M12 7 A2.5 2.5 0 1 0 12 12 A2.5 2.5 0 1 0 12 7 Z\"></path></svg>",
		sliders: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4 7 H13 M19 7 H20 M4 17 H6 M12 17 H20 M16 4.5 A2.5 2.5 0 1 0 16 9.5 A2.5 2.5 0 1 0 16 4.5 Z M9 14.5 A2.5 2.5 0 1 0 9 19.5 A2.5 2.5 0 1 0 9 14.5 Z\"></path></svg>",
		speakerOff: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4 9 H8 L13 5 V19 L8 15 H4 Z M17 9.5 L22 14.5 M22 9.5 L17 14.5\"></path></svg>",
		speaker: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4 9 H8 L13 5 V19 L8 15 H4 Z M16.5 8.5 C18 10 18 14 16.5 15.5 M19 6 C22 9 22 15 19 18\"></path></svg>",
		stop: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M7 7 H17 V17 H7 Z\"></path></svg>",
		info: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 3.5 A8.5 8.5 0 1 0 12 20.5 A8.5 8.5 0 1 0 12 3.5 Z M12 11 V16 M12 7.9 V8.1\"></path></svg>",
		refresh: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M19.5 12 A7.5 7.5 0 1 1 12 4.5 C14.1 4.5 16 5.4 17.4 6.8 L19.5 8.9 M19.5 4.2 V8.9 H14.8\"></path></svg>",
		actHike: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M2.5 19.5 L9.5 7.5 L13 13 L15.5 9.5 L21.5 19.5 Z M7.6 10.8 L9.5 12.6 L11.2 10.9\"></path></svg>",
		actBeach: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4 11 C4 6.5 7.6 3 12 3 C16.4 3 20 6.5 20 11 Z M12 11 V17.5 M3 20 C5 18.5 7 18.5 9 20 C11 21.5 13 21.5 15 20 C17 18.5 19 18.5 21 20\"></path></svg>",
		actSnow: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M2 20 L9 8 L16 20 Z M6.8 11.8 L9 13.5 L11.2 11.8 M18 3 V9 M15.4 4.5 L20.6 7.5 M15.4 7.5 L20.6 4.5\"></path></svg>",
		actOut: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M7 3 H15 C15 8 13.5 11 11 11 C8.5 11 7 8 7 3 Z M11 11 V19 M7.5 19 H14.5 M19 4 V8 M17 6 H21\"></path></svg>",
		actSport: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M3 17 V12 C3 11 3.8 10.5 4.7 10.5 H8 C9 13 12 14 15 14 C18 14 21 15 21 17 V18 H3 Z M3 16.5 H21 M2 7 H6 M4 4 H8\"></path></svg>",
		actCity: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M3 21 V10 L8 7 V21 M8 21 V3 H16 V21 M16 21 V10 H21 V21 M2 21 H22 M11 7 H13 M11 11 H13 M11 15 H13\"></path></svg>",
		actWork: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4 8 H20 A1.5 1.5 0 0 1 21.5 9.5 V18.5 A1.5 1.5 0 0 1 20 20 H4 A1.5 1.5 0 0 1 2.5 18.5 V9.5 A1.5 1.5 0 0 1 4 8 Z M9 8 V6 A1.5 1.5 0 0 1 10.5 4.5 H13.5 A1.5 1.5 0 0 1 15 6 V8 M2.5 13 H21.5\"></path></svg>",
		actCamp: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M3 20 L12 4 L21 20 Z M9 20 L12 13 L15 20 M9.5 3 L12 4 L14.5 3\"></path></svg>",
		actCycle: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M2 16.5 A3.5 3.5 0 1 0 9 16.5 A3.5 3.5 0 1 0 2 16.5 Z M15 16.5 A3.5 3.5 0 1 0 22 16.5 A3.5 3.5 0 1 0 15 16.5 Z M5.5 16.5 L9 9.5 H15 L18.5 16.5 M9 9.5 L12 16.5 L15 9.5 M8 6.5 H11 M15 9.5 L14 6 H16.5\"></path></svg>",
		stopwatch: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 6 A7.5 7.5 0 1 0 12 21 A7.5 7.5 0 1 0 12 6 Z M12 13.5 V10 M10 2.5 H14 M12 2.5 V6 M18.5 6.5 L20 5\"></path></svg>",
		star: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 3 L14.6 9 L21 9.6 L16 13.8 L17.6 20.2 L12 16.8 L6.4 20.2 L8 13.8 L3 9.6 L9.4 9 Z\"></path></svg>",
		untick: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M13.5 4.5 L19.5 10.5 L11 19 L5 13 Z M8.4 9.6 L14.4 15.6 M11 19 H20\"></path></svg>",
		undo: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M9 13.5 L4.5 9 L9 4.5 M4.5 9 H14 A5.5 5.5 0 0 1 14 20 H10.5\"></path></svg>",
		book: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4 5.5 C6.5 4.5 9.5 4.5 12 6 C14.5 4.5 17.5 4.5 20 5.5 V19 C17.5 18 14.5 18 12 19.5 C9.5 18 6.5 18 4 19 Z M12 6 V19.5\"></path></svg>",
		trash: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4.5 7 H19.5 M9.5 7 V4.5 H14.5 V7 M6.5 7 L7.4 19.5 H16.6 L17.5 7 M10 10.5 V16 M14 10.5 V16\"></path></svg>",
		chevronDown: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6 9 L12 15 L18 9\"></path></svg>",
		chevronUp: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6 15 L12 9 L18 15\"></path></svg>",
		temp: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M10 14 V5 A2 2 0 0 1 14 5 V14 A4 4 0 1 1 10 14 Z\"></path></svg>",
		rain: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 3 C12 3 5 11 5 15 A7 7 0 0 0 19 15 C19 11 12 3 12 3 Z\"></path></svg>",
		snow: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 3 V21 M4.2 7.5 L19.8 16.5 M4.2 16.5 L19.8 7.5\"></path></svg>",
		wind: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M3 8 H13 A3 3 0 1 0 10 5 M3 12 H18 A3 3 0 1 1 15 15 M3 16 H9\"></path></svg>",
		sun: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 8 A4 4 0 1 0 12 16 A4 4 0 1 0 12 8 Z M12 2 V4 M12 20 V22 M2 12 H4 M20 12 H22 M4.9 4.9 L6.3 6.3 M17.7 17.7 L19.1 19.1 M4.9 19.1 L6.3 17.7 M17.7 6.3 L19.1 4.9\"></path></svg>",
		dry: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 8 A4 4 0 1 0 12 16 A4 4 0 1 0 12 8 Z M12 2 V4 M12 20 V22 M2 12 H4 M20 12 H22\"></path></svg>",
		check: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M5 12 L10 17 L19 7\"></path></svg>",
		close: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6 6 L18 18 M18 6 L6 18\"></path></svg>",
		lock: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M5 11 H19 V21 H5 Z M8 11 V8 A4 4 0 0 1 16 8 V11\"></path></svg>",
		shield: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 3 L19.5 6 V11.5 C19.5 16 16.3 19.4 12 21 C7.7 19.4 4.5 16 4.5 11.5 V6 Z M8.8 12 L11 14.2 L15.4 9.8\"></path></svg>",
		search: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M11 4 A7 7 0 1 0 11 18 A7 7 0 1 0 11 4 Z M16 16 L21 21\"></path></svg>",
		locate: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 2 V5 M12 19 V22 M2 12 H5 M19 12 H22 M12 7 A5 5 0 1 0 12 17 A5 5 0 1 0 12 7 Z\"></path></svg>",
		calendar: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6 5.5 H18 A2 2 0 0 1 20 7.5 V18 A2 2 0 0 1 18 20 H6 A2 2 0 0 1 4 18 V7.5 A2 2 0 0 1 6 5.5 Z M4 10 H20 M8.5 3.5 V7 M15.5 3.5 V7\"></path></svg>",
		chevronLeft: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M15 6 L9 12 L15 18\"></path></svg>",
		chevronRight: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M9 6 L15 12 L9 18\"></path></svg>",
		share: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M18 2.5 A3 3 0 1 0 18 8.5 A3 3 0 1 0 18 2.5 Z M6 9 A3 3 0 1 0 6 15 A3 3 0 1 0 6 9 Z M18 15.5 A3 3 0 1 0 18 21.5 A3 3 0 1 0 18 15.5 Z M8.6 13.5 L15.4 17.4 M15.4 6.6 L8.6 10.5\"></path></svg>",
		edit: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M13 20 H20.5 M16.5 3.8 A2.2 2.2 0 0 1 19.6 6.9 L7.5 19 L3.5 20 L4.5 16 Z M14.5 5.8 L17.6 8.9\"></path></svg>",
		shareIos: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M8.5 10 H7 A1.5 1.5 0 0 0 5.5 11.5 V19 A1.5 1.5 0 0 0 7 20.5 H17 A1.5 1.5 0 0 0 18.5 19 V11.5 A1.5 1.5 0 0 0 17 10 H15.5 M12 3.5 V14 M8.5 7 L12 3.5 L15.5 7\"></path></svg>",
		plusSquare: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M7 4.5 H17 A2.5 2.5 0 0 1 19.5 7 V17 A2.5 2.5 0 0 1 17 19.5 H7 A2.5 2.5 0 0 1 4.5 17 V7 A2.5 2.5 0 0 1 7 4.5 Z M12 8.5 V15.5 M8.5 12 H15.5\"></path></svg>",
		arrowUp: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 19 V5 M6 11 L12 5 L18 11\"></path></svg>",
		arrowDown: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 5 V19 M6 13 L12 19 L18 13\"></path></svg>",
		warning: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 3.5 L21.5 20 H2.5 Z M12 10 V14 M12 17 V17.2\"></path></svg>",
		feels: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 3 A2.8 2.8 0 1 0 12 8.6 A2.8 2.8 0 1 0 12 3 Z M6 21 V16.5 A6 6 0 0 1 18 16.5 V21\"></path></svg>",
		daylight: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M3 18 H21 M7 18 A5 5 0 0 1 17 18 M12 5 V8 M4.9 9.9 L6.9 11.9 M19.1 9.9 L17.1 11.9 M8 21.5 H16\"></path></svg>",
		play: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M8 5.5 C8 4.7 8.9 4.2 9.6 4.7 L19 11.2 C19.6 11.6 19.6 12.4 19 12.8 L9.6 19.3 C8.9 19.8 8 19.3 8 18.5 Z\" fill=\"currentColor\"></path></svg>",
		clock: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 3.5 A8.5 8.5 0 1 0 12 20.5 A8.5 8.5 0 1 0 12 3.5 Z M12 7.5 V12 L15 14\"></path></svg>",
		flip: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4.5 10 A7.5 7.5 0 0 1 18 6.5 M18.5 2.5 V6.8 H14.2 M19.5 14 A7.5 7.5 0 0 1 6 17.5 M5.5 21.5 V17.2 H9.8\"></path></svg>",
		backpack: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M9 6 V4.5 A3 3 0 0 1 15 4.5 V6 M6 9 A3 3 0 0 1 9 6 H15 A3 3 0 0 1 18 9 V19.5 A1.5 1.5 0 0 1 16.5 21 H7.5 A1.5 1.5 0 0 1 6 19.5 Z M9 14 H15 V18 H9 Z M9 11 H15\"></path></svg>",
		thumbUp: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M7 11 V20 H4 V11 Z M7 11 L11 3 C12.5 3 13.6 4.2 13.2 5.8 L12.2 10 H18.5 C19.9 10 20.8 11.3 20.4 12.6 L18.6 18.6 C18.3 19.4 17.6 20 16.7 20 H7\"></path></svg>",
		thumbDown: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M7 13 V4 H4 V13 Z M7 13 L11 21 C12.5 21 13.6 19.8 13.2 18.2 L12.2 14 H18.5 C19.9 14 20.8 12.7 20.4 11.4 L18.6 5.4 C18.3 4.6 17.6 4 16.7 4 H7\"></path></svg>"
	},
	logo: {
		face: "<svg class=\"logo\" viewBox=\"0 0 36 36\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#291D18\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g class=\"logo__sun\"><path fill=\"none\" d=\"M25 1.2 V2.8 M31.4 3.6 L30.3 4.7 M34.2 9.5 H32.6 M18.6 3.6 L19.7 4.7\"></path><circle cx=\"25\" cy=\"10\" r=\"5.2\" fill=\"#B8A2F5\"></circle></g><rect class=\"logo__l1\" x=\"4\" y=\"25\" width=\"28\" height=\"9\" rx=\"4.5\" fill=\"#FCB679\"></rect><rect class=\"logo__l2\" x=\"7.5\" y=\"17\" width=\"21\" height=\"9\" rx=\"4.5\" fill=\"#FFCF9E\"></rect><g class=\"logo__l3\"><rect x=\"11\" y=\"9\" width=\"14\" height=\"9\" rx=\"4.5\" fill=\"#FFE3C2\"></rect><path class=\"logo__smile\" fill=\"none\" stroke-width=\"1.3\" d=\"M16.3 14.8 Q18 16.3 19.7 14.8\"></path><circle class=\"logo__eye\" cx=\"15.7\" cy=\"12.6\" r=\"0.86\" fill=\"#291D18\" stroke=\"none\"></circle><circle class=\"logo__eye logo__eye--r\" cx=\"20.3\" cy=\"12.6\" r=\"0.86\" fill=\"#291D18\" stroke=\"none\"></circle></g></g></svg>",
		plain: "<svg class=\"logo\" viewBox=\"0 0 36 36\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#291D18\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g class=\"logo__sun\"><path fill=\"none\" d=\"M25 1.2 V2.8 M31.4 3.6 L30.3 4.7 M34.2 9.5 H32.6 M18.6 3.6 L19.7 4.7\"></path><circle cx=\"25\" cy=\"10\" r=\"5.2\" fill=\"#B8A2F5\"></circle></g><rect class=\"logo__l1\" x=\"4\" y=\"25\" width=\"28\" height=\"9\" rx=\"4.5\" fill=\"#FCB679\"></rect><rect class=\"logo__l2\" x=\"7.5\" y=\"17\" width=\"21\" height=\"9\" rx=\"4.5\" fill=\"#FFCF9E\"></rect><g class=\"logo__l3\"><rect x=\"11\" y=\"9\" width=\"14\" height=\"9\" rx=\"4.5\" fill=\"#FFE3C2\"></rect></g></g></svg>"
	},
	eye: {
		brown: "<svg class=\"art\" viewBox=\"0 0 40 28\" aria-hidden=\"true\" focusable=\"false\"><defs><clipPath id=\"eye-brown\"><path d=\"M3 14 Q20 -1 37 14 Q20 29 3 14 Z\"></path></clipPath></defs><path d=\"M3 14 Q20 -1 37 14 Q20 29 3 14 Z\" fill=\"#FFFFFF\"></path><g clip-path=\"url(#eye-brown)\"><circle cx=\"20\" cy=\"14\" r=\"8\" fill=\"#7A4A2A\" stroke=\"#4A2A16\" stroke-width=\"1.4\"></circle><circle cx=\"20\" cy=\"14\" r=\"3.3\" fill=\"#291D18\"></circle><circle cx=\"17.4\" cy=\"11.4\" r=\"1.7\" fill=\"#FFFFFF\"></circle></g><path d=\"M3 14 Q20 -1 37 14 Q20 29 3 14 Z\" fill=\"none\" stroke=\"#291D18\" stroke-width=\"2.2\" stroke-linejoin=\"round\"></path><path d=\"M12 7.2 L10.4 4.6 M20 5.4 V2.4 M28 7.2 L29.6 4.6\" stroke=\"#291D18\" stroke-width=\"2\" stroke-linecap=\"round\"></path></svg>",
		hazel: "<svg class=\"art\" viewBox=\"0 0 40 28\" aria-hidden=\"true\" focusable=\"false\"><defs><clipPath id=\"eye-hazel\"><path d=\"M3 14 Q20 -1 37 14 Q20 29 3 14 Z\"></path></clipPath></defs><path d=\"M3 14 Q20 -1 37 14 Q20 29 3 14 Z\" fill=\"#FFFFFF\"></path><g clip-path=\"url(#eye-hazel)\"><circle cx=\"20\" cy=\"14\" r=\"8\" fill=\"#9C9444\" stroke=\"#5E5A22\" stroke-width=\"1.4\"></circle><circle cx=\"20\" cy=\"14\" r=\"5\" fill=\"#8A5A2E\"></circle><circle cx=\"20\" cy=\"14\" r=\"3.3\" fill=\"#291D18\"></circle><circle cx=\"17.4\" cy=\"11.4\" r=\"1.7\" fill=\"#FFFFFF\"></circle></g><path d=\"M3 14 Q20 -1 37 14 Q20 29 3 14 Z\" fill=\"none\" stroke=\"#291D18\" stroke-width=\"2.2\" stroke-linejoin=\"round\"></path><path d=\"M12 7.2 L10.4 4.6 M20 5.4 V2.4 M28 7.2 L29.6 4.6\" stroke=\"#291D18\" stroke-width=\"2\" stroke-linecap=\"round\"></path></svg>",
		green: "<svg class=\"art\" viewBox=\"0 0 40 28\" aria-hidden=\"true\" focusable=\"false\"><defs><clipPath id=\"eye-green\"><path d=\"M3 14 Q20 -1 37 14 Q20 29 3 14 Z\"></path></clipPath></defs><path d=\"M3 14 Q20 -1 37 14 Q20 29 3 14 Z\" fill=\"#FFFFFF\"></path><g clip-path=\"url(#eye-green)\"><circle cx=\"20\" cy=\"14\" r=\"8\" fill=\"#4E9E6C\" stroke=\"#2A6441\" stroke-width=\"1.4\"></circle><circle cx=\"20\" cy=\"14\" r=\"3.3\" fill=\"#291D18\"></circle><circle cx=\"17.4\" cy=\"11.4\" r=\"1.7\" fill=\"#FFFFFF\"></circle></g><path d=\"M3 14 Q20 -1 37 14 Q20 29 3 14 Z\" fill=\"none\" stroke=\"#291D18\" stroke-width=\"2.2\" stroke-linejoin=\"round\"></path><path d=\"M12 7.2 L10.4 4.6 M20 5.4 V2.4 M28 7.2 L29.6 4.6\" stroke=\"#291D18\" stroke-width=\"2\" stroke-linecap=\"round\"></path></svg>",
		blue: "<svg class=\"art\" viewBox=\"0 0 40 28\" aria-hidden=\"true\" focusable=\"false\"><defs><clipPath id=\"eye-blue\"><path d=\"M3 14 Q20 -1 37 14 Q20 29 3 14 Z\"></path></clipPath></defs><path d=\"M3 14 Q20 -1 37 14 Q20 29 3 14 Z\" fill=\"#FFFFFF\"></path><g clip-path=\"url(#eye-blue)\"><circle cx=\"20\" cy=\"14\" r=\"8\" fill=\"#5B9FDB\" stroke=\"#2F6399\" stroke-width=\"1.4\"></circle><circle cx=\"20\" cy=\"14\" r=\"3.3\" fill=\"#291D18\"></circle><circle cx=\"17.4\" cy=\"11.4\" r=\"1.7\" fill=\"#FFFFFF\"></circle></g><path d=\"M3 14 Q20 -1 37 14 Q20 29 3 14 Z\" fill=\"none\" stroke=\"#291D18\" stroke-width=\"2.2\" stroke-linejoin=\"round\"></path><path d=\"M12 7.2 L10.4 4.6 M20 5.4 V2.4 M28 7.2 L29.6 4.6\" stroke=\"#291D18\" stroke-width=\"2\" stroke-linecap=\"round\"></path></svg>"
	},
	part: {
		morning: "<svg class=\"art\" viewBox=\"0 0 40 40\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#291D18\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M11 29 A9 9 0 0 1 29 29 Z\" fill=\"#FCB679\"></path><path fill=\"none\" d=\"M4 29 H36 M20 13 V16 M9 18 L11 20 M31 18 L29 20\"></path><path fill=\"none\" d=\"M16 36 L20 32 L24 36\"></path></g></svg>",
		afternoon: "<svg class=\"art\" viewBox=\"0 0 40 40\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#291D18\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"20\" cy=\"15\" r=\"7\" fill=\"#F5C131\"></circle><path fill=\"none\" d=\"M20 3 V5 M20 25 V27 M8 15 H10 M30 15 H32 M11.5 6.5 L13 8 M27 22 L28.5 23.5 M11.5 23.5 L13 22 M27 8 L28.5 6.5\"></path><path fill=\"none\" d=\"M4 34 H36\"></path></g></svg>",
		evening: "<svg class=\"art\" viewBox=\"0 0 40 40\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#291D18\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M24 6 A12 12 0 1 0 34 24 A9.5 9.5 0 0 1 24 6 Z\" fill=\"#D3DBE3\"></path><path fill=\"none\" d=\"M8 7 V11 M6 9 H10 M31 32 V35 M29.5 33.5 H32.5\"></path></g></svg>"
	}
}, Y = {
	clothing: (e, { active: t = !0 } = {}) => J.clothing[e][t ? "on" : "off"],
	weather: (e) => J.weather[e],
	face: (e) => J.face[e],
	ui: (e) => J.ui[e],
	logo: ({ face: e = !0 } = {}) => J.logo[e ? "face" : "plain"],
	eye: (e) => J.eye[e],
	part: (e) => J.part[e]
}, X = "\n:host {\n  --lw-text: var(--primary-text-color, #1d1b20);\n  --lw-muted: var(--secondary-text-color, #5d5a62);\n  --lw-line: var(--divider-color, rgba(0, 0, 0, 0.12));\n  --lw-tile: var(--secondary-background-color, #f2f0f4);\n  --lw-accent: var(--primary-color, #6031b0);\n  --lw-on-accent: var(--text-primary-color, #ffffff);\n  display: block;\n}\n* { box-sizing: border-box; }\n.lw {\n  container-type: inline-size;\n  padding: 16px;\n  color: var(--lw-text);\n  display: grid;\n  gap: 14px;\n}\nsvg { display: block; width: 100%; height: 100%; }\nul, ol { list-style: none; margin: 0; padding: 0; }\nh2, h3, p { margin: 0; }\n.note { color: var(--lw-muted); font-size: 1rem; }\n\n.lw__top { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; }\n.lw__place { display: flex; align-items: center; gap: 10px; min-width: 0; }\n.lw__place b { display: block; font-size: 1.125rem; font-weight: 700; line-height: 1.2; }\n.lw__place small { display: block; color: var(--lw-muted); font-size: 0.875rem; }\n.lw__logo { width: 36px; height: 36px; flex: none; }\n\n.lw__switch { display: inline-flex; padding: 3px; gap: 2px; border-radius: 999px; background: var(--lw-tile); }\n.lw__switch button {\n  font: inherit; font-size: 0.875rem; font-weight: 600; border: 0; border-radius: 999px; padding: 6px 14px;\n  background: transparent; color: var(--lw-text); cursor: pointer;\n}\n.lw__switch button[aria-pressed='true'] { background: var(--lw-accent); color: var(--lw-on-accent); }\n.lw__switch button:focus-visible { outline: 2px solid var(--lw-accent); outline-offset: 2px; }\n\n.lw__main { display: grid; gap: 16px; }\n.lw__lead { display: grid; gap: 8px; align-content: start; }\n.lw__headline { font-size: 1.75rem; font-weight: 800; line-height: 1.12; letter-spacing: -0.01em; }\n.lw__summary { color: var(--lw-muted); font-size: 1rem; line-height: 1.4; }\n.lw__chips { display: flex; flex-wrap: wrap; gap: 6px; }\n.lw__chip {\n  display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 999px;\n  background: var(--lw-tile); font-size: 0.875rem; font-weight: 600;\n}\n.lw__chip svg { width: 16px; height: 16px; }\n\n.lw__outfit { display: grid; gap: 10px; align-content: start; }\n.lw__strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }\n.lw__part {\n  display: grid; justify-items: center; gap: 2px; padding: 8px 4px; border-radius: 14px; background: var(--lw-tile);\n  font-size: 0.8125rem; text-align: center;\n}\n.lw__part svg { width: 34px; height: 34px; }\n.lw__part b { font-size: 0.875rem; }\n.lw__part small { color: var(--lw-muted); }\n.lw__part--past { opacity: 0.45; }\n.lw__part--on { box-shadow: inset 0 0 0 2px var(--lw-accent); }\n\n.lw__label {\n  display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em;\n  text-transform: uppercase; color: var(--lw-muted);\n}\n.lw__label svg { width: 16px; height: 16px; }\n.lw__tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(78px, 1fr)); gap: 10px 6px; }\n.lw__tile { display: grid; justify-items: center; gap: 4px; text-align: center; font-size: 0.8125rem; font-weight: 600; line-height: 1.2; }\n.lw__box { width: 64px; height: 64px; padding: 8px; border-radius: 16px; background: var(--lw-tile); }\n\n.lw__bag { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 0.9375rem; line-height: 1.35; }\n.lw__bag-icon { width: 20px; height: 20px; flex: none; color: var(--lw-muted); }\n.lw__bag > span:nth-child(2) { flex: 1 1 200px; }\n.lw__bag-items { display: flex; gap: 4px; }\n.lw__mini { width: 30px; height: 30px; }\n\n/* Kids: one big weather word with its face, and big pictures. */\n.lw__kids { display: grid; gap: 14px; }\n.lw__scene { display: flex; align-items: center; gap: 16px; padding: 12px 16px; border-radius: 20px; background: var(--lw-tile); }\n.lw__scene-art { position: relative; width: 96px; height: 96px; flex: none; }\n.lw__face { position: absolute; right: -8px; bottom: -8px; width: 46px; height: 46px; }\n.lw__word { display: block; font-size: 2.5rem; font-weight: 800; line-height: 1; }\n.lw__temp { display: block; font-size: 1.375rem; font-weight: 700; color: var(--lw-muted); }\n.lw__scene small { display: block; color: var(--lw-muted); font-size: 0.875rem; }\n.lw__tiles--kids { grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: 12px; }\n.lw__tiles--kids .lw__tile { font-size: 1.0625rem; font-weight: 700; }\n.lw__tiles--kids .lw__box { width: 100px; height: 100px; padding: 12px; border-radius: 22px; }\n.lw__tiles--bag .lw__box { width: 72px; height: 72px; }\n\n.lw__credit { font-size: 0.75rem; color: var(--lw-muted); text-align: right; }\n\n/* Dark themes: the pictures keep their colours and get a soft light edge, as in the app. */\n.lw--dark .lw__box svg, .lw--dark .lw__mini svg, .lw--dark .lw__part svg, .lw--dark .lw__scene-art svg, .lw--dark .lw__logo svg {\n  filter: drop-shadow(0 0 0.75px rgba(239, 244, 251, 0.9)) drop-shadow(0 0 0.75px rgba(239, 244, 251, 0.6));\n}\n\n/* A wall tablet: headline left, outfit right; everything a size up. */\n@container (min-width: 640px) {\n  .lw { padding: 20px 24px; }\n  .lw__main { grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 24px; }\n  .lw__headline { font-size: 2.25rem; }\n  .lw__box { width: 76px; height: 76px; }\n  .lw__tiles { grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); }\n  .lw__kids { grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); align-items: start; }\n  .lw__kids .lw__label, .lw__tiles--bag { grid-column: 2; }\n  .lw__scene { flex-direction: column; align-items: flex-start; grid-row: span 3; }\n  .lw__scene-art { width: 140px; height: 140px; }\n  .lw__face { width: 64px; height: 64px; }\n  .lw__word { font-size: 3.25rem; }\n}\n@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }\n";
//#endregion
//#region \0@oxc-project+runtime@0.151.0/helpers/esm/typeof.js
function Z(e) {
	"@babel/helpers - typeof";
	return Z = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, Z(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.151.0/helpers/esm/toPrimitive.js
function be(e, t) {
	if (Z(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (Z(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.151.0/helpers/esm/toPropertyKey.js
function xe(e) {
	var t = be(e, "string");
	return Z(t) == "symbol" ? t : t + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.151.0/helpers/esm/defineProperty.js
function Q(e, t, n) {
	return (t = xe(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
//#endregion
//#region card/src/editor.ts
var Se = class extends HTMLElement {
	constructor(...e) {
		super(...e), Q(this, "config", {}), Q(this, "hassNow", void 0), Q(this, "form", void 0);
	}
	setConfig(e) {
		this.config = e, this.render();
	}
	set hass(e) {
		this.hassNow = e, this.render();
	}
	render() {
		this.form || (this.form = document.createElement("ha-form"), this.form.addEventListener("value-changed", (e) => {
			let t = { ...e.detail.value };
			for (let [e, n] of Object.entries(t)) (n === "" || n === void 0) && delete t[e];
			this.dispatchEvent(new CustomEvent("config-changed", {
				detail: { config: t },
				bubbles: !0,
				composed: !0
			}));
		}), this.appendChild(this.form));
		let e = (this.hassNow?.locale?.language ?? this.hassNow?.language ?? "en").slice(0, 2), t = he(de.some((t) => t.id === e) ? e : "en", "metric"), n = {
			entity: "Place (zone, person or device tracker)",
			name: "Name on the card",
			mode: t.t("mode.label"),
			show_mode_switch: `${t.t("mode.everyone")} / ${t.t("mode.kids")}`,
			language: t.t("settings.language"),
			units: t.t("settings.units"),
			sensitivity: t.t("settings.feel"),
			style: t.t("settings.style"),
			eyes: t.t("settings.eyes"),
			allergies: t.t("settings.allergies")
		}, r = (e) => ({ select: {
			mode: "dropdown",
			options: e.map(([e, t]) => ({
				value: e,
				label: t
			}))
		} });
		this.form.hass = this.hassNow, this.form.data = {
			show_mode_switch: !0,
			...this.config
		}, this.form.computeLabel = (e) => n[e.name] ?? e.name, this.form.schema = [
			{
				name: "entity",
				selector: { entity: { domain: [
					"zone",
					"person",
					"device_tracker"
				] } }
			},
			{
				name: "name",
				selector: { text: {} }
			},
			{
				name: "mode",
				selector: r([["everyone", t.t("mode.everyone")], ["kids", t.t("mode.kids")]])
			},
			{
				name: "show_mode_switch",
				selector: { boolean: {} }
			},
			{
				name: "language",
				selector: r(de.map((e) => [e.id, e.name]))
			},
			{
				name: "units",
				selector: r([["metric", t.t("settings.metric")], ["imperial", t.t("settings.imperial")]])
			},
			{
				name: "sensitivity",
				selector: r([
					["cold", t.t("settings.feel.cold")],
					["normal", t.t("settings.feel.normal")],
					["hot", t.t("settings.feel.hot")]
				])
			},
			{
				name: "style",
				selector: r([["women", t.t("settings.style.women")], ["men", t.t("settings.style.men")]])
			},
			{
				name: "eyes",
				selector: r([
					"brown",
					"hazel",
					"green",
					"blue"
				].map((e) => [e, t.t(`settings.eyes.${e}`)]))
			},
			{
				name: "allergies",
				selector: { boolean: {} }
			}
		];
	}
};
customElements.get("layers-weather-card-editor") || customElements.define("layers-weather-card-editor", Se);
//#endregion
//#region card/src/layers-weather-card.ts
var Ce = "0.1.1", we = [
	"en",
	"de",
	"fr",
	"es",
	"bg"
], Te = 18e5, Ee = 3e5, De = (e) => `layers-weather-card:mode:${e.entity ?? "zone.home"}`, Oe = (e) => Math.round(e * 100) / 100, $ = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]), ke = (e, t) => e && e.charAt(0).toLocaleUpperCase(t) + e.slice(1), Ae = (e) => e.replace(/\s*\(.*\)\s*$/, ""), je = class extends HTMLElement {
	constructor() {
		super(), Q(this, "config", { type: "custom:layers-weather-card" }), Q(this, "hassNow", void 0), Q(this, "forecast", void 0), Q(this, "fetchedFor", ""), Q(this, "fetchedAt", 0), Q(this, "loading", !1), Q(this, "failed", !1), Q(this, "mode", "everyone"), Q(this, "timer", void 0), Q(this, "drawn", ""), Q(this, "root", void 0), this.root = this.attachShadow({ mode: "open" }), this.root.addEventListener("click", (e) => {
			let t = e.target.closest("[data-mode]");
			if (t) {
				this.mode = t.dataset.mode === "kids" ? "kids" : "everyone";
				try {
					localStorage.setItem(De(this.config), this.mode);
				} catch {}
				this.render();
			}
		});
	}
	setConfig(e) {
		if (!e) throw Error("Invalid configuration");
		this.config = e;
		let t = null;
		try {
			t = e.show_mode_switch === !1 ? null : localStorage.getItem(De(e));
		} catch {
			t = null;
		}
		this.mode = t === "kids" || t === "everyone" ? t : e.mode ?? "everyone", this.render();
	}
	set hass(e) {
		this.hassNow = e, this.refresh(), this.render(!1);
	}
	connectedCallback() {
		this.timer = window.setInterval(() => {
			this.refresh(), this.render();
		}, 6e4);
	}
	disconnectedCallback() {
		window.clearInterval(this.timer);
	}
	getCardSize() {
		return 7;
	}
	getGridOptions() {
		return {
			columns: 12,
			min_columns: 6,
			rows: "auto"
		};
	}
	static async getConfigElement() {
		return await Re(), document.createElement("layers-weather-card-editor");
	}
	static getStubConfig() {
		return { entity: "zone.home" };
	}
	place() {
		let e = this.hassNow;
		if (!e) return null;
		let t = e.states[this.config.entity ?? "zone.home"]?.attributes ?? {}, n = typeof t.latitude == "number" ? t.latitude : e.config?.latitude, r = typeof t.longitude == "number" ? t.longitude : e.config?.longitude;
		if (typeof n != "number" || typeof r != "number") return null;
		let i = this.config.name ?? e.config?.location_name ?? (typeof t.friendly_name == "string" ? t.friendly_name : "");
		return {
			lat: Oe(n),
			lon: Oe(r),
			name: i
		};
	}
	settings() {
		let e = this.hassNow, t = (this.config.language ?? e?.locale?.language ?? e?.language ?? "en").slice(0, 2).toLowerCase();
		return {
			lang: we.includes(t) ? t : "en",
			units: this.config.units ?? (e?.config?.unit_system?.temperature === "°F" ? "imperial" : "metric"),
			style: this.config.style === "women" ? "girl" : this.config.style === "men" ? "boy" : "neutral",
			sensitivity: this.config.sensitivity ?? "normal",
			eyes: this.config.eyes,
			allergies: this.config.allergies ?? !1
		};
	}
	refresh() {
		let e = this.place();
		if (!e || this.loading) return;
		let t = `${e.lat},${e.lon}`, n = Date.now() - this.fetchedAt;
		t === this.fetchedFor && n < (this.failed ? Ee : Te) || (this.loading = !0, W(e.lat, e.lon).then((e) => {
			this.forecast = e, this.failed = !1;
		}).catch(() => {
			this.failed = !0;
		}).finally(() => {
			this.loading = !1, this.fetchedFor = t, this.fetchedAt = Date.now(), this.render();
		}));
	}
	render(e = !0) {
		let t = this.settings(), n = JSON.stringify([
			this.config,
			this.mode,
			t,
			this.place(),
			!!this.hassNow?.themes?.darkMode,
			this.forecast?.fetchedAt,
			this.failed,
			Math.floor(Date.now() / 6e4)
		]);
		if (!e && n === this.drawn) return;
		this.drawn = n;
		let r = he(t.lang, t.units, t.style, this.mode === "kids"), i = this.place(), a = this.forecast, o = a ? ce(a.timezone, Date.now(), a.now) : null, s = a && o && i ? P(a.days, o, {
			sensitivity: t.sensitivity,
			latitude: i.lat,
			forKids: this.mode === "kids",
			allergies: t.allergies,
			eyes: t.eyes
		}) : null, c = o && s ? le(o, s) : "today", l = s ? c === "today" ? s.today ?? s.tomorrow : s.tomorrow : null, u = !!this.hassNow?.themes?.darkMode, d;
		d = i ? !l || !o ? `<p class="note">${$(r.t(this.failed ? "status.error" : "status.loading"))}</p>` : this.mode === "kids" ? Le(l, r) : Ie(l, r) : `<p class="note">${$("Set a place: a zone, person or device tracker with a position (default: zone.home).")}</p>`;
		let f = i ? Me(i.name, c, o, r) : "", p = this.config.show_mode_switch === !1 ? "" : Ne(this.mode, r);
		this.root.innerHTML = `<style>${X}</style>
      <ha-card class="lw${u ? " lw--dark" : ""}${this.mode === "kids" ? " lw--kids" : ""}">
        <div class="lw__top">${f}${p}</div>
        ${d}
        <p class="lw__credit">${$(r.t("settings.credit"))}</p>
      </ha-card>`;
	}
};
function Me(e, t, n, r) {
	let i = n ? r.time(n.hour, n.minute) : "";
	return `<div class="lw__place">
      <span class="lw__logo">${Y.logo()}</span>
      <span><b>${$(e)}</b><small>${$(r.t(`day.${t}`))}${i ? ` · ${$(i)}` : ""}</small></span>
    </div>`;
}
function Ne(e, t) {
	let n = (n) => `<button type="button" data-mode="${n}" aria-pressed="${e === n}">${$(Ae(t.t(`mode.${n}`)))}</button>`;
	return `<div class="lw__switch" role="group" aria-label="${$(t.t("mode.label"))}">${n("everyone")}${n("kids")}</div>`;
}
function Pe(e, t) {
	return [...new Map(e.map((e) => [t.kind(e), e])).values()];
}
function Fe(e, t) {
	return `<li class="lw__tile"><span class="lw__box">${Y.clothing(t.kind(e))}</span><span>${$(t.item(e))}</span></li>`;
}
function Ie(e, t) {
	let n = e.views[0], r = n?.part ?? e.parts[0].part, i = Pe((e.kids.find((e) => e.part === r)?.wear ?? []).filter((e) => e !== "socksEveryday"), t), a = e.chips.map((e) => `<li class="lw__chip">${Y.ui(e.icon)}${$(t.msg(e.msg))}</li>`).join(""), o = e.strip.map((e) => `<li class="lw__part${e.past ? " lw__part--past" : ""}${e.part === r ? " lw__part--on" : ""}">
        <span>${$(t.part(e.part))}</span>${Y.weather(e.icon)}<b>${$(t.layers(e.layers))}</b><small>${$(t.temp(e.feels))}</small></li>`).join(""), s = n?.bag, c = s ? s.leaving ? ge(s.bag, t) : B(s, t) : "", l = s ? Pe(s.bag.map((e) => e.kind), t).map((e) => `<span class="lw__mini">${Y.clothing(t.kind(e))}</span>`).join("") : "";
	return `<div class="lw__main">
      <section class="lw__lead">
        <h2 class="lw__headline">${$(t.msgs(e.headline))}</h2>
        <p class="lw__summary">${$(t.msgs(e.summary))}</p>
        <ul class="lw__chips">${a}</ul>
      </section>
      <section class="lw__outfit">
        <ol class="lw__strip">${o}</ol>
        <h3 class="lw__label">${$(t.msg({
		key: "view.heading",
		params: { when: {
			kind: "parts",
			parts: [r],
			all: !1
		} }
	}))}</h3>
        <ul class="lw__tiles">${i.map((e) => Fe(e, t)).join("")}</ul>
        ${c ? `<p class="lw__bag"><span class="lw__bag-icon">${Y.ui("backpack")}</span><span><b>${$(t.t("bring.title"))}:</b> ${$(c)}</span><span class="lw__bag-items">${l}</span></p>` : ""}
      </section>
    </div>`;
}
function Le(e, t) {
	let n = e.kids[0], r = e.parts.find((e) => e.part === n.part)?.conditions ?? e.parts[0].conditions, i = ke(t.t(`word.${r.word}`), t.locale), a = Pe(n.wear, t), o = Pe(n.bag.leaving ? n.bag.bag.map((e) => e.kind) : n.bag.out, t);
	return `<div class="lw__kids">
      <section class="lw__scene">
        <span class="lw__scene-art">${Y.weather(r.icon)}<span class="lw__face">${Y.face(ue(r.word))}</span></span>
        <span><span class="lw__word">${$(i)}</span><span class="lw__temp">${$(t.temp(r.tempAvg))}</span><small>${$(t.part(n.part))}</small></span>
      </section>
      <ul class="lw__tiles lw__tiles--kids">${a.map((e) => Fe(e, t)).join("")}</ul>
      ${o.length ? `<h3 class="lw__label">${Y.ui("backpack")} ${$(t.t("kids.bag"))}</h3><ul class="lw__tiles lw__tiles--bag">${o.map((e) => Fe(e, t)).join("")}</ul>` : ""}
    </div>`;
}
async function Re() {
	if (customElements.get("ha-form")) return;
	let e = window;
	try {
		await (await (await e.loadCardHelpers?.())?.createCardElement({
			type: "entities",
			entities: []
		}))?.constructor.getConfigElement?.();
	} catch {}
}
customElements.get("layers-weather-card") || customElements.define("layers-weather-card", je);
var ze = window;
ze.customCards = ze.customCards ?? [], ze.customCards.some((e) => e.type === "layers-weather-card") || ze.customCards.push({
	type: "layers-weather-card",
	name: "Layers Weather",
	description: "What to wear for the weather today: layers, shoes, hat, umbrella and what to take. For grown-ups and kids.",
	preview: !0,
	documentationURL: "https://github.com/eybox/layers-weather-card"
}), console.info(`%c LAYERS-WEATHER-CARD %c ${Ce} `, "background:#6031b0;color:#fff;border-radius:4px 0 0 4px", "background:#fcb679;color:#291d18;border-radius:0 4px 4px 0");
//#endregion
export { Ce as CARD_VERSION };
