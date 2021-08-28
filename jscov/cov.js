class CovMain {
    constructor(parameterObj){
        this.confirmedToday = parameterObj.confirmedToday;
        let confirmed1WeekAgo = parameterObj.confirmed1WeekAgo;
        let confirmed2WeekAgo = parameterObj.confirmed2WeekAgo;

        this.confirmedTotal = parameterObj.confirmedTotal;
        this.vaccinatedTotal = parameterObj.vaccinatedTotal;
        
        this.population = parameterObj.population;
        this.normalReproduceRate = parameterObj.normalReproduceRate;
        this.emergencyReproduceRate = parameterObj.emergencyReproduceRate;
        this.reproduceRate = this.normalReproduceRate;
        this.incubationPeriod = parameterObj.incubationPeriod;
        this.spreadDays = parameterObj.spreadDays;
        this.confirmDelay = parameterObj.confirmDelay;
        this.confirmRate = parameterObj.confirmPercent / 100.0;
        this.vaccinatePerDay = parameterObj.vaccineDosePerDay / 2.0;
        this.vaccineEffectiveness = parameterObj.vaccineEffectivenessPercent / 100.0;
        this.vaccineWantRate = parameterObj.vaccineWantPercent / 100.0;

        this.history = Array(this.incubationPeriod + this.spreadDays + this.confirmDelay + 1);
        this.history.fill(0);
        this.confirmedHistory = Array(this.incubationPeriod + this.spreadDays + this.confirmDelay + 1);
        this.confirmedHistory.fill(0);
        this.vaccinatedHistory = Array(this.incubationPeriod + this.spreadDays + this.confirmDelay + 1);
        this.vaccinatedHistory.fill(0);
        this.infectTotalHistory = Array(this.incubationPeriod + this.spreadDays + this.confirmDelay + 1);
        this.infectTotalHistory.fill(0);
        this.confirmedTotalHistory = Array(this.incubationPeriod + this.spreadDays + this.confirmDelay + 1);
        this.confirmedTotalHistory.fill(0);
        this.vaccinatedTotalHistory = Array(this.incubationPeriod + this.spreadDays + this.confirmDelay + 1);
        this.vaccinatedTotalHistory.fill(0);
        this.immuneTotalHistory = Array(this.incubationPeriod + this.spreadDays + this.confirmDelay + 1);
        this.immuneTotalHistory.fill(0);
        this.startDay = this.incubationPeriod + this.spreadDays + this.confirmDelay;
        this.today = this.startDay;

        this.initialExtraPolation(this.confirmedToday, confirmed1WeekAgo, confirmed2WeekAgo);

        this.confirmedTotal = parameterObj.confirmedTotal;
        this.infectTotal = this.confirmedTotal / this.confirmRate;
        this.infectTotalHistory[this.today] = this.infectTotal;
        this.confirmedTotalHistory[this.today] = this.confirmedTotal;
    }

    initialExtraPolation(confirmedToday, confirmed1WeekAgo, confirmed2WeekAgo){
        let diffrate1 = (confirmedToday - confirmed1WeekAgo) / 7.0;
        let diffrate2 = (confirmed1WeekAgo - confirmed2WeekAgo) / 7.0;

        let day;
        let curconf = this.confirmedToday;

        for(day = this.startDay; day >= 0; day--){
            this.confirmedHistory[day] = curconf;
            let infectday = day - this.confirmDelay - this.incubationPeriod;
            if(infectday >= 0){
                let infect = curconf / this.confirmRate;
                this.history[infectday] = infect;
            }
            if(day > this.startDay - 7){
                curconf -= diffrate1;
            }else if(day > this.startDay - 14){
                curconf -= diffrate2;
            }
            if(curconf < 0) curconf = 0;
        }

        this.today = this.startDay - this.confirmDelay - this.incubationPeriod;

        this.infectTotal = this.confirmedTotal / this.confirmRate;
        let infeimmu = this.infectTotal;
        let vaccimmu = this.vaccinatedTotal * this.vaccineEffectiveness;
        let common = infeimmu * vaccimmu / this.population; //infect_rate * vaccine_rate * population
        this.immunerNum = infeimmu + vaccimmu - common;

        do{
            this.processDay();
        }while(this.today < this.startDay);

        return;
    }

    calcSpreaderNum(){
        let result = 0;
        let start = this.today - this.incubationPeriod;
        for(let i=0; i < this.spreadDays; i++){
            let d = start - i;
            if(d < 0) break;
            result += this.history[d];
        }
        return result;
    }

    processDay(){
        this.today++;
        let spreadernum = this.calcSpreaderNum();
        let increase_rate = this.reproduceRate / this.spreadDays;
        let protect_rate = (this.population - this.immunerNum) / this.population;
        this.todayInfect = spreadernum * increase_rate * protect_rate;
        this.history[this.today] = this.todayInfect;
        this.infectTotal += this.todayInfect;
        this.immunerNum += this.todayInfect;
        this.todayConfirmed = this.calcConfirm();
        this.confirmedTotal += this.todayConfirmed;

        this.processDayVaccinate();

        this.recordHistory();
    }

    calcConfirm(){
        let result = 0;
        if(this.today - this.incubationPeriod - this.confirmDelay - 1 >= 0 && this.incubationPeriod + this.confirmDelay >= 1){
            let tmp = 0;
            tmp += this.history[this.today - this.incubationPeriod - this.confirmDelay - 1];
            tmp += this.history[this.today - this.incubationPeriod - this.confirmDelay];
            tmp += this.history[this.today - this.incubationPeriod - this.confirmDelay + 1];
            result = tmp * this.confirmRate / 3.0;
        } else if(this.today - this.incubationPeriod - this.confirmDelay >= 0){
            result = this.history[this.today - this.incubationPeriod - this.confirmDelay] * this.confirmRate;
        } else result = 0;

        return result;
    }

    processDayVaccinate(){
        if(this.vaccinatedTotal < this.population * this.vaccineWantRate){
            this.todayVaccinated = this.vaccinatePerDay;
        }else{
            this.todayVaccinated = 0;
            return;
        }
        
        this.vaccinatedTotal += this.todayVaccinated;
        let alreadyImmuneRate = this.infectTotal / this.population;        //assuming that reinfection is negligible
        this.immunerNum += this.todayVaccinated * (1.0 - alreadyImmuneRate) * this.vaccineEffectiveness;
    }

    recordHistory(){
        this.confirmedHistory[this.today] = this.todayConfirmed;
        this.vaccinatedHistory[this.today] = this.todayVaccinated;
        this.infectTotalHistory[this.today] = this.infectTotal;
        this.confirmedTotalHistory[this.today] = this.confirmedTotal;
        this.vaccinatedTotalHistory[this.today] = this.vaccinatedTotal;
        this.immuneTotalHistory[this.today] = this.immunerNum;
    }

    getConfirmedHistory(){
        return this.confirmedHistory.slice(this.startDay);
    }

    getInfectedHistory(){
        return this.history.slice(this.startDay);
    }

    getVaccinatedHistory(){
        return this.vaccinatedHistory.slice(this.startDay);
    }

    getConfirmedTotalHistory(){
        return this.confirmedTotalHistory.slice(this.startDay);
    }

    getInfectedTotalHistory(){
        return this.infectTotalHistory.slice(this.startDay);
    }

    getVaccinatedTotalHistory(){
        return this.vaccinatedTotalHistory.slice(this.startDay);
    }

    getImmuneTotalHistory(){
        return this.immuneTotalHistory.slice(this.startDay);
    }

    emergency(){
        this.reproduceRate = this.emergencyReproduceRate;
    }

    endEmergency(){
        this.reproduceRate = this.normalReproduceRate;
    }
}