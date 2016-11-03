//  landing.ts
//  Divinitor landing page main script

enum PALADINSStatus {
    CHECKING,
    DOWN,
    UP
};

var paladinsStatus: PALADINSStatus = PALADINSStatus.CHECKING;

function checkPALADINSStatus(): void {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.onreadystatechange = () => 
    {
        if (xhr.readyState == XMLHttpRequest.DONE)
        {
            if (xhr.status === 200)
            {
                console.log("PALADINS gateway is up");
                paladinsStatus = PALADINSStatus.UP;
            }
            else
            {
                console.log("PALADINS gateway is unreachable");
                paladinsStatus = PALADINSStatus.DOWN;
            }
        }
    } 
    xhr.open("GET", "https://paladins.divinitor.com/status/gateway", true);
    xhr.send(null);
}

(function () {
    window.onload = (evt: Event) => {
        checkPALADINSStatus();
    }
})();
