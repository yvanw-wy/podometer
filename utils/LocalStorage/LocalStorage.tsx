import AsyncStorage from "@react-native-async-storage/async-storage"

const _storeDatas = async (datas: any, key: any) => { // Function allowing to Store datas
    try {
        await AsyncStorage.setItem(key, JSON.stringify(datas));
        return "Success"
    } catch (e) {
        return `Failed  - ${e}`
    }
}

const _retrieveDatas = async (key: any) => {
    try {
        const getDatas : any = await AsyncStorage.getItem(key);
        return JSON.parse(getDatas);
    } catch (e) {
        return `Failed  - ${e}`
    }
    
}

const _deleteDatas = async (key: any) => {
    try {
        await AsyncStorage.removeItem(key);
        return "success"
    } catch (e) {
        return `Failed  - ${e}`
    }

}

export { _storeDatas, _retrieveDatas, _deleteDatas }