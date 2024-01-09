
import { SelectObjectsView } from '../reportsModules/class/SelectObjectsView.js'

export let classReports;
export function reportsContainer(avl) {
    if (!classReports) {
        classReports = new SelectObjectsView()
    }
    classReports.createListShablons(avl)
}