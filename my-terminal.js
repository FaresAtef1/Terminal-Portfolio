function rainbow(string) {
    return lolcat.rainbow(function (char, color) {
        char = $.terminal.escape_brackets(char);
        return `[[;${hex(color)};]${char}]`;
    }, string).join('\n');
}

function hex(color) {
    return '#' + [color.red, color.green, color.blue].map(n => {
        return n.toString(16).padStart(2, '0');
    }).join('');
}

let greeting = rainbow(greetings.innerHTML);
const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
});

let user = 'guest';
const server = 'FaresAtef.org';

function prompt() {
    return `[[;#44D544;]${user}@${server}]:[[;#0000FF;]${cwd}]$ `;
}

const directories = {
    education: [
        'B.E. in Computer Engineering with an 88% CGPA (Excellence) from Cairo University, Faculty of Engineering, expected to graduate in July 2025.'],
    projects: {
        Google_Summer_of_Code_Projects: [
            '<a href="https://gist.github.com/FaresAtef1/b2b0b3ccebef8b60a0690f7ff2f291fc">Better (de)serialization support for objects_2023</a>',
            '<a href="https://gist.github.com/FaresAtef1/20a28f074d1bddec3d57c52d3e74a168">Implement The New Parser_2024</a>'],
        College_Projects: [
            '<a href="https://github.com/FaresAtef1/style-transfer">Artistic Style Transfer Using Texture Synthesis</a>',
            '<a href="https://github.com/FaresAtef1/Qwitter-DevOps">Qwitter (X clone)</a>',
            '<a href="https://github.com/FaresAtef1/5-stage-pipeline-processor">5-Stage Pipeline Processor</a>',
            '<a href="https://github.com/FaresAtef1/DuckDuckGoose-Search-Engine">DuckDuckGoose</a>',
            '<a href="https://github.com/FaresAtef1/Horus-Hidden-Passage">Horus Hidden Passage</a>',
            '<a href="https://github.com/FaresAtef1/Operating-System-Project">OS Scheduler</a>',
            '<a href="https://github.com/FaresAtef1/Arabic-Font-Recognition">Arabic Font Recognition</a>',
            '<a href="https://github.com/FaresAtef1/FIFA-World-Cup-Qatar-2022-Reservation-System">FIFA World Cup Reservation System</a>',
            '<a href="https://github.com/FaresAtef1/Snakes-Ladders-Monopoly">Snakes Ladders Monopoly</a>',
            '<a href="https://github.com/FaresAtef1/AES-Advanced-Encryption-Standard">AES Advanced Encryption Standard</a>',
            '<a href="https://github.com/FaresAtef1/RT-Chess-Assembly">RT Chess Assembly</a>',
            '<a href="https://github.com/FaresAtef1/Shipping-Company">Shipping Company</a>'],
        Personal_Projects: [
            '<a href="https://github.com/FaresAtef1/JSON-Parser">JSON Parser</a>',
            '<a href="https://github.com/FaresAtef1/Terminal-Portfolio">Terminal Portfolio</a>']
    },
    skills: {
        Programming_Languages: ['C++', 'Python', 'C', 'C#', 'Java', 'Java Script', 'Assembly', 'Bash'],
        Hardware_Description_Languages: ['Verilog', 'VHDL'],
        Web_Development: ['HTML', 'CSS', 'Express (Node.js)'],
        DevOps_Tools: ['Docker', 'Jenkins', 'AWS', 'Azure', 'Grafana', 'Prometheus'],
        Tools: ['Git', 'Make', 'MySQL', 'MongoDB']
    }
};

const secondToFirst = {};
for (const first in directories) {
    if (directories.hasOwnProperty(first)) {
        for (const second in directories[first]) {
            secondToFirst[second] = first;
        }
    }
}

function print_dirs(root) {
    const allItems = [];
    for (const category in root) {
        if (root.hasOwnProperty(category)) {
            allItems.push(`<span class="directory">${category}</span>`);
        }
    }
    term.echo(allItems.join('<br>'), { raw: true });
}

function print_list(list) {
    const allItems = [];
    for (const item of list) {
        allItems.push(`<span class="item">${item}</span>`);
    }
    term.echo(allItems.join('<br>'), { raw: true });
}

const root = '~';
let cwd = root;
const url = 'https://v2.jokeapi.dev/joke/Programming';

const commands = {
    help() {
        const command_list = ['clear'].concat(Object.keys(commands));
        const formatted_list = command_list.map(cmd => {
            return `<span class="command"">${$.terminal.escape_brackets(cmd)}</span>`;
        }).join('<br>');
        term.echo(`List of available commands:<br>${formatted_list}`, { raw: true });
    },
    useradd(name) {
        if (name) {
            user = name;
        } else {
            this.error('Please provide a username');
        }
    },
    echo(...args) {
        if (args.length)
            term.echo(args.join(' '));
    },
    cd(dir = null) {
        if (dir === null || (dir === '..' && cwd.substring(cwd.lastIndexOf('/') + 1) in directories)) {
            cwd = root;
        } else if (dir === '..' && cwd !== root && cwd.substring(cwd.lastIndexOf('/') + 1) in secondToFirst) {
            cwd = root + '/' + secondToFirst[cwd.substring(cwd.lastIndexOf('/') + 1)];
        } else if (dir.startsWith('~/') && dir.substring(2) in directories) {
            cwd = dir;
        } else if (dir.startsWith('~/') && (dir.split('/').length - 1 === 2) && dir.substring(dir.lastIndexOf('/') + 1) in secondToFirst) {
            cwd = dir;
        } else if (dir in directories && cwd === root) {
            cwd = root + '/' + dir;
        } else if (dir in secondToFirst && secondToFirst[dir] === cwd.substring(cwd.lastIndexOf('/') + 1)) {
            cwd += '/' + dir;
        } else if (cwd === root && (dir.split('/').length - 1 === 1) && dir.split('/')[0] in directories && dir.split('/')[1] in secondToFirst) {
            cwd += '/' + dir;
        } else {
            this.error('Wrong directory');
        }
    },
    ls(dir = null) {
        if (dir) {
            if (dir.match(/^~\/?$/)) {
                // ls ~ or ls ~/
                print_dirs(directories);
            } else if (dir.startsWith('~/')) {
                const path = dir.substring(2);
                const dirs = path.split('/');
                if (dirs.length === 2) {
                    if (dirs[0] in directories && dirs[1] in directories[dirs[0]]) {
                        print_list(directories[dirs[0]][dirs[1]]);
                    } else {
                        this.error('Invalid directory');
                    }
                } else if (dirs.length === 1) {
                    const dir = dirs[0];
                    if (dir in directories) {
                        if (dir === 'skills' || dir === 'projects') {
                            print_dirs(directories[dir]);
                        } else {
                            print_list(directories[dir]);
                        }
                    }
                    else {
                        this.error('Invalid directory');
                    }
                } else {
                    this.error('Invalid directory');
                }
            } else if (cwd === root && dir !== '..') {
                if (dir in directories) {
                    if (dir === 'skills' || dir === 'projects') {
                        print_dirs(directories[dir]);
                    } else {
                        print_list(directories[dir]);
                    }
                } else {
                    if (dir.split('/').length - 1 === 1) {
                        const dirs = dir.split('/');
                        if (dirs[0] in directories && dirs[1] in directories[dirs[0]]) {
                            print_list(directories[dirs[0]][dirs[1]]);
                        } else {
                            this.error('Invalid directory');
                        }
                    } else {
                        this.error('Invalid directory');
                    }
                }
            } else if (dir === '..') {
                print_dirs(directories);
            } else if (dir in secondToFirst && secondToFirst[dir] === cwd.substring(cwd.lastIndexOf('/') + 1)) {
                print_list(directories[secondToFirst[dir]][dir]);
            }
            else {
                this.error('Invalid directory');
            }
        } else if (cwd === root) {
            print_dirs(directories);
        } else {
            const level = cwd.split('/').length - 1;
            if (level === 1) {
                const dir = cwd.substring(2);
                const prev_dir = cwd.substring(cwd.lastIndexOf('/') + 1);
                if (prev_dir === 'skills' || prev_dir === 'projects') {
                    print_dirs(directories[dir]);
                } else {
                    print_list(directories[dir]);
                }
            } else if (level === 2) {
                const dir = cwd.substring(cwd.lastIndexOf('/') + 1);
                print_list(directories[secondToFirst[dir]][dir]);
            }
            else {
                this.error('Invalid directory');
            }
        }
    },
    async joke() {
        const res = await fetch(url);
        const data = await res.json();
        (async () => {
            if (data.type == 'twopart') {
                const prompt = this.get_prompt();
                this.set_prompt('');
                await this.echo(`Q: ${data.setup}`, {
                    delay: 15,
                    typing: true
                });
                await this.echo(`A: ${data.delivery}`, {
                    delay: 15,
                    typing: true
                });
                this.set_prompt(prompt);
            } else if (data.type === 'single') {
                await this.echo(data.joke, {
                    delay: 15,
                    typing: true
                });
            }
        })();
    },
    credits() {
        this.echo([
            'Fares Atef <a href="mailto:faresatef553@gmail.com">faresatef553@gmail.com</a>',
        ].join('<br>'), { raw: true });
    }
};

const term = $('body').terminal(commands, {
    greetings: greeting + '\n[[;white;]Welcome to my Terminal Portfolio! Type [[;blue;]help] to see what I can do. Have fun exploring!]\n',
    checkArity: false,
    completion() {
        const cmd = this.get_command();
        const { name, rest } = $.terminal.parse_command(cmd);
        if (['cd', 'ls'].includes(name)) {
            if (rest.startsWith('~/')) {
                const allDirs = Object.values(directories).flat();
                return allDirs.map(dir => `~/${dir}`);
            }
            if (cwd === root) {
                return Object.keys(directories);
            }
        }
        return Object.keys(commands);
    },
    exit: false,
    prompt
});

// term.exec('help', { typing: true, delay: 100 });

term.on('click', '.command', function () {
    const command = $(this).text();
    term.exec(command);
});
term.on('click', '.directory', function () {
    const dir = $(this).text();
    term.exec(`cd ${cwd}/${dir}`);
});
