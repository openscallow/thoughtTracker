// place files you want to import through the `$lib` alias in this folder.
export function date() {
    let dateObj = new Date()
    let date = `${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`

    return date;
}