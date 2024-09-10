import React from 'react';

const TrainCard = ({ train, fromStation, toStation, date, selectClass, showTrainSchedule, handleBook }) => {

    let from = train.route.find((routeStop) => {
        return routeStop.station.name.toLowerCase() === fromStation.toLowerCase();
    });

    let to = train.route.find((routeStop) => {
        return routeStop.station.name.toLowerCase() === toStation.toLowerCase();
    });

    // Check if fromStation exists before toStation in the route array
    const fromIndex = train.route.findIndex((routeStop) => routeStop.station.name.toLowerCase() === fromStation.toLowerCase());
    const toIndex = train.route.findIndex((routeStop) => routeStop.station.name.toLowerCase() === toStation.toLowerCase());

    // If fromStation comes after toStation or if either is not found, check the return_route array
    if (parseInt(fromIndex) > parseInt(toIndex)) {
        // Fallback to the return_route array
        from = train?.return_route?.find((routeStop) => {
            return routeStop.station.name.toLowerCase() === fromStation.toLowerCase();
        });

        to = train?.return_route?.find((routeStop) => {
            return routeStop.station.name.toLowerCase() === toStation.toLowerCase();
        });
    }

    // Function to get travel time
    function getTravelTime(departure, arrival) {
        if (departure && arrival) {
            const [depHours, depMinutes] = departure.split(':').map(Number);
            const [arrHours, arrMinutes] = arrival.split(':').map(Number);

            let depInMinutes = depHours * 60 + depMinutes;
            let arrInMinutes = arrHours * 60 + arrMinutes;

            // If arrival time is on the next day (e.g., 23:00 to 01:00)
            if (arrInMinutes < depInMinutes) {
                arrInMinutes += 24 * 60;
            }

            const diffInMinutes = arrInMinutes - depInMinutes;
            const hours = Math.floor(diffInMinutes / 60);
            const minutes = diffInMinutes % 60;

            return {
                format1: `${hours}h ${minutes}m`,
                format2: `${hours}:${minutes}`,
            };
        }
        return undefined;
    }

    // Function to find arrival date
    function findArrivalDate(departureDateTime, duration) {
        if (duration) {
            const [date, time] = departureDateTime.split(',');
            const [hours, minutes] = time.split(':').map(Number);
            const [durationHours, durationMinutes] = duration.split('h').map(part => part.trim().replace('m', '')).map(Number);

            // Create a Date object for the departure date and time in UTC
            const [year, month, day] = date.split('-').map(Number);
            const departure = new Date(Date.UTC(year, month - 1, day, hours, minutes));

            // Add duration to the departure time
            departure.setUTCHours(departure.getUTCHours() + durationHours);
            departure.setUTCMinutes(departure.getUTCMinutes() + durationMinutes);

            // Format the arrival date and time in UTC
            const arrivalDate = departure.toISOString().split('T')[0];
            const arrivalTime = departure.toISOString().split('T')[1].slice(0, 5); // "HH:MM"
            const arrivalDay = departure.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });

            return {
                date: arrivalDate,
                time: arrivalTime,
                day: arrivalDay
            };
        }
        return { date: '', time: '', day: '' }; // Return empty values if duration is not provided
    }

    // Function to format date
    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            weekday: 'short'
        }).replace(',', '');

    const travel = getTravelTime(from?.departure_time, to?.arrival_time);
    const travel_duration = travel?.format1;
    let departure_date = formatDate(date);

    // Ensure arrivalDate calculation only if travel_duration is available
    let arrivalDate = travel_duration ? findArrivalDate(`${date},${from?.departure_time}`, travel_duration) : { date: '', time: '', day: '' };

    const daysMapping = {
        Sun: 'S',
        Mon: 'M',
        Tue: 'T',
        Wed: 'W',
        Thu: 'T',
        Fri: 'F',
        Sat: 'S'
    };

    const weekDaysOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const daysOfOperation = train?.day_of_operation || [];
    const returnDaysOfOperation = train?.return_day_of_operation || [];

    const formatAndSortDays = (days) => {
        return weekDaysOrder
            .map(day => daysMapping[day])
            .filter((_, index) => days.includes(weekDaysOrder[index]))
            .join(' ');
    };

    const formattedDaysOfOperation = formatAndSortDays(daysOfOperation);
    const formattedReturnDaysOfOperation = formatAndSortDays(returnDaysOfOperation);

    // Data object for booking
    const data = {
        train: train,
        from: from,
        to: to,
        date: date,
        travel_duration: travel_duration,
        departure_date: departure_date,
        arrivalDate: formatDate(arrivalDate.date),
        class: train.class,
        fare: train.fare,
    };

    // calculate class fare
    let distance = 0;
    if (fromIndex > toIndex) {
        distance = train?.return_route?.find(trn => to?.station._id === trn.station._id)?.distance - train?.return_route?.find(trn => from?.station._id === trn.station._id)?.distance;
    } else {
        distance = train?.route?.find(trn => to?.station._id === trn.station._id)?.distance - train?.route?.find(trn => from?.station._id === trn.station._id)?.distance;;
    }

    const classes = train?.class?.map(cls => {
        const baseFare = train?.base_fare;
        const distanceFare = (distance * baseFare) + cls.fare;
        return { ...cls, fare: distanceFare };
    });

    return (
        <article className="border border-gray-500 rounded my-4 overflow-auto">
            <div className="flex justify-between px-4 bg-gray-200 flex-wrap">
                <p className="p-2 font-bold text-xl">{train.name} ({train.train_number})</p>
                <p className="p-2 flex gap-2">Runs On :
                    <span>{formattedDaysOfOperation} / {formattedReturnDaysOfOperation}</span>
                </p>
                <p onClick={() => showTrainSchedule(train._id)} id="train_schedule_btn" className="p-2 text-blue-500 font-bold hover:underline cursor-pointer">Train
                    Schedule</p>
            </div>
            <div className="flex justify-between flex-wrap mx-5 p-2">
                <div>
                    <span className="font-bold text-xl">{from?.departure_time} |</span>
                    <span>{from?.station?.name} |</span>
                    <span>{departure_date}</span>
                </div>
                <div>
                    <span className="font-bold text-gray-400">----</span>
                    <span>{travel_duration}</span>
                    <span className="font-bold text-gray-400">-----</span>
                </div>
                <div>
                    <span className="font-bold text-xl">{arrivalDate.time} |</span>
                    <span>{to?.station?.name} |</span>
                    <span>{formatDate(arrivalDate.date)}</span>
                </div>
            </div>

            <div className="mx-5 py-2 flex flex-wrap gap-2">
                {classes?.length > 0 && (
                    classes?.map((item, index) => (
                        <article
                            key={index}
                            onClick={() => selectClass(train._id, item.name)}
                            className={item.selected ? "p-3 px-8 border border-green-500 bg-green-200 rounded hover:cursor-pointer w-full md:w-1/3 lg:w-auto" : "p-3 px-8 border border-gray-400 rounded hover:cursor-pointer w-full md:w-1/3 lg:w-auto"}>
                            <p className="font-bold">{item.name}</p>
                            <p className="font-bold text-red-500">&#8377;{item.fare}</p>
                        </article>
                    ))
                )}
            </div>

            <div className="p-3 ms-2">
                <button onClick={() => handleBook(data)}
                    className="bg-orange-600 text-white px-5 py-2 font-semibold rounded hover:bg-orange-700">Book</button>
            </div>
        </article>
    );
};

export default TrainCard;
