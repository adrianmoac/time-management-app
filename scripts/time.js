const timeHeader = document.querySelector('.actual-time');

export function updateTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');

    const formattedTime = `${hours}:${minutes}`;

    timeHeader.textContent = formattedTime;
}
updateTime();

setInterval(updateTime, 1000);