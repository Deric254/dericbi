-- retrieve the entire table of covid_deaths

select * from covid_deaths
order by 1,2
;

--  retrieve the entire table of covid_vaccinations

select * from covid_vaccinations
order by 1,2
;
-- (1)  select data we are using 
select location, date,total_cases,new_cases,total_deaths,population
from covid_deaths
where location like '%kenya'
order by 1,2 
;
-- view(1)
create view dataUsed as 
select location, date,total_cases,new_cases,total_deaths,population
from covid_deaths
where location like '%kenya'
order by 1,2 
;
-- view(1)

-- (2) total cases vrs total deaths
-- shows the lkelyhood of dying from covid

select location, date,total_cases,round((total_deaths/total_cases*100),0) as 'deathPercentage'
from covid_deaths
 where location like '%kenya%'
order by deathPercentage asc
;
-- view(2
create view totalcasesvrstotaldeaths as
select location, date,total_cases,round((total_deaths/total_cases*100),0) as 'deathPercentage'
from covid_deaths
 where location like '%kenya%'
order by deathPercentage asc
;
-- view(2)

-- (3) looking at total cases vs population
-- shows the lkelyhood of contacting  covid
select location, date,population,total_cases ,round((total_cases/population*100),1) as 'infectedPercentage'
from covid_deaths
 where location like '%kenya%'
order by infectedPercentage desc
;

-- view(3)

create view  totalcasesvspopulation as
select location, date,population,total_cases ,round((total_cases/population*100),1) as 'infectedPercentage'
from covid_deaths
 where location like '%kenya%'
order by infectedPercentage desc
;

-- view(3)
-- (4) looking at which country has the highest infection rate compared to population

select location, population,max(total_cases) as 'highest infection ount' ,round((max(total_cases/population ) * 100),0) as 'infectedPercentage'
from covid_deaths
 -- where location like '%kenya%'
 group by location, population
order by infectedpercentage desc
;

-- view (4)
create view highestinfectionrate as
select location, population,max(total_cases) as 'highest infection ount' ,round((max(total_cases/population ) * 100),0) as 'infectedPercentage'
from covid_deaths
 -- where location like '%kenya%'
 group by location, population
order by infectedpercentage desc
;
-- view (4)


-- (5) shows countries with highest deathcount per population

select location,max(total_deaths) as 'highestDeathcount' 
from covid_deaths
 -- where location like '%kenya%'
 where location not in (continent)
 group by location
order by highestDeathcount desc
;

-- view (5)
create view  highestdeathcount as
select location,max(total_deaths) as 'highestDeathcount' 
from covid_deaths
 -- where location like '%kenya%'
 where location not in (continent)
 group by location
order by highestDeathcount desc
;
-- view (5)

-- (6) LETSBREAK IT DOWN BY CONTINENT 
-- showing the continent with highest deathcount per population

select continent,max(total_deaths) as 'highestDeathcount' 
from covid_deaths
 -- where location like '%kenya%'
 where continent not in (location)
 group by continent
order by highestDeathcount desc
;
-- view (6)
create view  continentwithhighestdeathcount as
select continent,max(total_deaths) as 'highestDeathcount' 
from covid_deaths
 -- where location like '%kenya%'
 where continent not in (location)
 group by continent
order by highestDeathcount desc
;
-- view (6)

-- (7) breaking everything globaly"aggregate funtions"

select  date,sum(new_cases) as 'total cases',sum(new_deaths) as 'total deaths',round((sum(new_deaths)/sum(new_cases)*100),1) as 'death percentage'
from covid_deaths
where continent not in(location)
group by date
order by 1,2
;
-- view (7)
create view  globalagggregate as
select  date,sum(new_cases) as 'total cases',sum(new_deaths) as 'total deaths',round((sum(new_deaths)/sum(new_cases)*100),1) as 'death percentage'
from covid_deaths
where continent not in(location)
group by date
order by 1,2
;
-- view (7)
-- 8 magical giving one big total

select  sum(new_cases) as 'total cases',sum(new_deaths) as 'total deaths',round((sum(new_deaths)/sum(new_cases)*100),1) as 'death percentage'
from covid_deaths
where continent not in(location)
order by 1,2
;


--  9 we are now diving in to covid_vaccination
-- -- Join query for our both tables
select* 
from covid_deaths       cd
join covid_vaccinations cv
on cd.date=cv.date and cd.location=cv.location
;

-- 10 checking total population vaccinated
-- Rolling vaccinations 

select cd.continent,cd.location,cd.date,cd.population,cv.new_vaccinations ,sum(cv.new_vaccinations) over(partition by cd.location order by cd.location,cd.date) as 'cumulative vaccinations'
from covid_deaths       cd
join covid_vaccinations cv
on  cd.location=cv.location and  cd.date=cv.date 
where cd.continent is not null -- and cv.location like '%kenya%'  and cv.new_vaccinations not in(0,81900)
order by 2,3
;

-- 11 lets see the percentage of the population vaccinated in each country
-- use CTE
with populationVaccinated(continent,location,date,population,new_vaccinations,cumulativeVaccinations)
as
(
select cd.continent,cd.location,cd.date,cd.population,cv.new_vaccinations ,sum(cv.new_vaccinations) over(partition by cd.location order by cd.location,cd.date) as cumulativeVaccinations
from covid_deaths       cd
join covid_vaccinations cv
on  cd.location=cv.location and  cd.date=cv.date 
where cd.continent is not null -- and cv.location like '%kenya%'  and cv.new_vaccinations not in(0,81900)
-- order by 2,3
)
select * ,round(((cumulativeVaccinations/population)*100),2) as 'vaccinated percentage'
from populationVaccinated
;
   -- 12 Temp table instead of cte
drop table if exists percentPopulationVaccinated;
CREATE TEMPORARY TABLE percentPopulationVaccinated (
  continent VARCHAR(255),
  location VARCHAR(255),
  date DATE,
  population DECIMAL(18,2),
  new_vaccinations DECIMAL(18,2),
  cumulativeVaccinations DECIMAL(18,2)
);

INSERT INTO percentPopulationVaccinated
SELECT cd.continent,
       cd.location,
       cd.date,
       cd.population,
       cv.new_vaccinations,
       SUM(cv.new_vaccinations) OVER (PARTITION BY cd.location ORDER BY cd.date) AS cumulativeVaccinations
FROM covid_deaths cd
JOIN covid_vaccinations cv
  ON cd.location = cv.location AND cd.date = cv.date
WHERE cd.continent IS NOT NULL;

SELECT *,
       ROUND(((cumulativeVaccinations / NULLIF(population,0)) * 100),2) AS `vaccinated percentage`
FROM percentPopulationVaccinated;


-- (13) creating views to store data for later visualizations 
-- view (13)
create view percentPopulationVaccinated as
SELECT cd.continent,
       cd.location,
       cd.date,
       cd.population,
       cv.new_vaccinations,
       SUM(cv.new_vaccinations) OVER (PARTITION BY cd.location ORDER BY cd.date) AS cumulativeVaccinations
FROM covid_deaths cd
JOIN covid_vaccinations cv
  ON cd.location = cv.location AND cd.date = cv.date
WHERE cd.continent IS NOT NULL;

-- view (13)







   
   

  
   
   
   
   
   
   
   
   