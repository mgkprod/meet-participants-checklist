const root = document.querySelector('.crqnQb');
const observerConfig = { attributes: false, childList: true, subtree: true };
const participantData = {};

let isParticipantListObserverSet = false;

const participantObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        const isParticipantRemoved = mutation.removedNodes.length && mutation.removedNodes[0].nodeName == 'DIV';
        const isParticipantAdded = (mutation.addedNodes.length && mutation.addedNodes[0].nodeName == 'DIV') &&
            (mutation.addedNodes[0].hasAttribute('role')) &&
            (mutation.addedNodes[0].getAttribute('role') == 'listitem');
        if (mutation.type == 'childList' && (isParticipantAdded || isParticipantRemoved)) {
            addCheckBoxes()
        }
    }
})

const rootObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            const sidebar = document.querySelector('.R3Gmyc:not(.qdulke)')
            if (sidebar) {
                if (!isParticipantListObserverSet) {
                    const participantContainer = document.querySelector('[aria-label="Participants"]');
                    participantObserver?.observe(participantContainer, { childList: true, subtree: true });
                    isParticipantListObserverSet = true;
                    addCheckBoxes();
                } else if (mutation.removedNodes.length && mutation.removedNodes[0].classList != undefined && mutation.removedNodes[0].classList.contains('checklist')) {
                    addCheckBoxes();
                }
            }
        }
    }
})
rootObserver.observe(root, observerConfig);

function addCheckBoxes() {
    const participantsNL = document.querySelectorAll('[role="listitem"]');
    for (const participantN of participantsNL) {
        const checkbox = Object.assign(document.createElement('input'), {
            type: "checkbox",
            className: "checklist",
            onclick: handleChecklist,
        });

        const checkNameWrap = Object.assign(document.createElement('label'), {
            style: "display: flex; align-items: center; cursor: pointer;",
            className: 'checklist-wrapper',
        });
        checkNameWrap.appendChild(checkbox);

        if (!participantN.children[0].classList.contains('checklist-wrapper')) {
            checkNameWrap.appendChild(participantN.children[0]);
            participantN.prepend(checkNameWrap);
            const participantName = participantN.getAttribute('aria-label');
            checkbox.setAttribute('data-participant', participantName);
            const participantList = JSON.parse(localStorage.getItem('meet-participants'));
            if (participantList && participantList[participantName]) {
                checkbox.checked = true
            }
        }
    }
}

function handleChecklist() {
    participantData[this.getAttribute('data-participant')] = this.checked;
    localStorage.setItem('meet-participants', JSON.stringify(participantData));
}

window.addEventListener('beforeunload', () => {
    localStorage.removeItem('meet-participants');
});
