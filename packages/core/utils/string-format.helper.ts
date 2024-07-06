export class StringFormat {
    static format(template: string, ...values: string[]) {
        return template.replace(/{(\d+)}/g, (match, index) => values[index]);
    }
}
