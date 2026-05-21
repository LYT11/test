import dayjs from "dayjs"
export function timeFormatter(datetime, template = 'YYYY-MM-DD HH:mm:ss') {
	return dayjs(datetime).format(template)
}
