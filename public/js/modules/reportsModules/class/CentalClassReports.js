import { Content } from './ContentGeneration.js'
import { GetDataRequests } from './GetDataRequests.js'
import { AddMapClass } from './AddMapClass.js'
import { NewReportTemplate } from './NewReportsTemplate.js'
import { GetUpdateStruktura } from '../../../GetUpdateStruktura.js'
import { ControllListWindow } from './ControllListWindow.js'
import { GetReports } from './ControlTemplatesCalendar.js'
export class CentalClassReports {
    constructor(container) {
        this.container = container
        this.resourses = GetUpdateStruktura.resourseData
        this.permisions = GetUpdateStruktura.propertyResourse
        this.params = {}
        this.init()
    }


    init() {
        this.container.innerHTML = Content.addRazmetka()
        this.caseElements()
        this.dostupControll()
        this.getObjectAndCreateListElements()
        this.getTemplatesAndCreateListElements()
        this.jobMap()
        new NewReportTemplate(this.container, this.wrapReports)
        new GetReports(this.interval, this.object, this.shablons, this.container)
        new ControllListWindow(this.container)
    }



    caseElements() {
        this.wrapReports = this.container.querySelectorAll('.toggle_reports')
        this.wrapMap = this.container.querySelector('.reports_maps')
        this.createReports = this.container.querySelector('.create_reports')
        this.deleteTemplate = this.container.querySelector('.delete_template')
        this.editionTemplate = this.container.querySelector('.edition_template')
        this.interval = this.container.querySelector('.interval_reports')
        this.shablons = this.container.querySelector('.up_shablons')
        this.object = this.container.querySelector('.object')
    }

    dostupControll() {
        if (this.permisions && this.permisions[0].reports === 'false') {
            this.createReports.remove()
            this.deleteTemplate.remove()
            this.editionTemplate.remove()
        }
    }
    getObjectAndCreateListElements() {
        this.objects = GetDataRequests.getObjects()
        const collection = Object.entries(this.objects.reduce((acc, e) => {
            console.log(e.groupName)
            const group = e.groupName ? e.groupName : 'Без группы';
            if (!acc[group]) {
                acc[group] = []
            }
            acc[group].push(e)
            return acc
        }, {}))
        //  this.wrapReports[0].innerHTML = Content.addContent(this.objects)
        console.log(collection)
        collection.sort((a, b) => a[0].localeCompare(b[0]));
        collection.forEach(e => {
            e[1].sort((a, b) => a.name.localeCompare(b.name))
        })
        console.log(collection)
        this.wrapReports[0].innerHTML = Content.addContentHTML(collection)
    }

    async getTemplatesAndCreateListElements() {
        this.resoursesID = this.resourses.map(e => e.idResourse)
        this.templates = await GetDataRequests.getTemplates(this.resoursesID, 'reports')
        if (this.templates.length === 0) return
        this.temp = this.templates.map(e => ({ id: e.uniqTemplateID, name: e.nameTemplate, idResoure: e.uniqResourseID }))
        this.wrapReports[1].innerHTML = Content.addContent(this.temp)
    }
    jobMap() {
        new AddMapClass(this.wrapMap)
    }
}