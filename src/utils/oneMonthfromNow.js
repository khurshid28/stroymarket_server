function oneMonthFromNow(d,month) {
    d.setHours(d.getHours()+5); 
    var targetMonth = d.getMonth() + month;
    d.setMonth(targetMonth);
    // if(d.getMonth() !== targetMonth % 12) {
    //     d.setDate(0); // last day of previous month
    // }
    return d;
}

module.exports = oneMonthFromNow