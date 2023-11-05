function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

const accounts = [
	"ebde428e-b60f-45a8-9953-1dc3ebac491c",
	"14f30ae4-3922-4ed2-a83b-9faa46374e94",
	"74a9b600-e49e-428f-8fbf-3b9089f57f94",
	"e3fe816b-7f55-4387-9590-82cd39252c7c",
	"862e33ec-c329-450f-adf8-be902d159f28",
	"3855ec71-b369-418c-aa12-2cbafd115805",
]
const notes = [
	"We all have to communicate with people on a daily basis, so it’s inevitable that we’ll occasionally be put off, if not downright offended, by the things we hear",
	" But consider the possibility that sometimes you may be guilty of rubbing people the wrong way",
	"\n\nAs a public speaking trainer, I always urge people to think carefully about their listeners before speaking",
	" It’s impossible to evaluate every word ahead of time, but it’s helpful to be aware of phrases or attitudes that keep us from communicating effectively",
	" \n\nHere are seven rude phrases that people with poor speech etiquette always use — and what to say instead",
	"\n\nThis phrase is great when you’re offering someone a choice (“Do you want to go to lunch with me?”)",
	" But as a way of delivering orders (“Do you want to take out the trash?”), its indirect fake-politeness comes across as belittling",
	"\n\nWhat to say instead: State your request directly",
	" It’s courteous to broach a request by asking, “Will you do me a favor?” After all, people generally like to pitch in",
	" But they don’t like to feel manipulated",
	"\n\nThis phrase insists that whatever follows will be the final, authoritative take on the subject at hand",
	" Even when used inadvertently, it can sound a bit self-important",
	" Truly authoritative people don’t tend to waste time on throat-clearing statements",
	"\n\nIn recent years, it’s become normalized for this pushy rhetorical nudge to follow questions, especially in interviews with athletes and politicians",
	" (“This is the most important stretch of the season, right?” or “We’ve never seen a circumstance like this, right?”)",
	"",
]
let value = Array.from({ length: 50 }, (e, i) => {
	const amount = `${getRandomInt(1, 10000)}.${getRandomInt(1, 1000)}`

	const note = `${notes[getRandomInt(0, notes.length - 1)]}`

	return [
		`2023-${getRandomInt(1, 12)}-${getRandomInt(1, 27)}T16:00:00.000Z`,
		amount,
		"840bd88c-bbab-453a-a4fc-670e0ebf3ca6",
		`${accounts[getRandomInt(0, 5)]}`,
		`to_tsvector('${amount}'|| ' ' || coalesce('${note}', ''))`,
	]
})
