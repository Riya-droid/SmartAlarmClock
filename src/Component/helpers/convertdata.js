import React from 'react'

export function convertdata(array) {
    let ob = {}
    for(let i =0 ;i<array.length;i++){
        ob[array[i].id] = array[i]
    }
    return ob
}

export function convertback(object) {
    let ob = []
    for(let item in object){
        ob.push(object[item])
    }
    return ob
}