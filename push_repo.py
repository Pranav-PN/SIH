import os
import subprocess

repo = r'C:\projects\SIH'
remote_url = 'https://github.com/Pranav-PN/SIH.git'

os.chdir(repo)

def run(args):
    print('RUN:', ' '.join(args))
    res = subprocess.run(args, capture_output=True, text=True)
    if res.stdout:
        print(res.stdout.strip())
    if res.stderr:
        print(res.stderr.strip())
    print('RC=', res.returncode)
    return res.returncode

run(['git', 'status', '--short'])
run(['git', 'remote', 'remove', 'origin'])
run(['git', 'remote', 'add', 'origin', remote_url])
run(['git', 'add', '.'])
run(['git', 'config', 'user.name', 'Pranav PN'])
run(['git', 'config', 'user.email', 'pranavpn@users.noreply.github.com'])
run(['git', 'commit', '-m', 'Initial civic dashboard implementation'])
run(['git', 'push', '-u', 'origin', 'main'])
