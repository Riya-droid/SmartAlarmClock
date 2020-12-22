export async function searchName (key, searchIndex) {
    const list = []
    searchIndex.forEach((item) => {
        if (item.name.includes(key)) {
            list.push(item)
        }
    })

    return list
}

export async function searchCode (key, searchIndex) {
    const list = []
    searchIndex.forEach((item) => {
        if ((item.code.toString()).includes(key)) {
            list.push(item)
        }
    })

    return list
}