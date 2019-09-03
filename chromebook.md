<br />

## Why Chromebooks?

Chromebooks are one of the most secure operating systems available. They're also cheap and lightweight. As such, companies often tell developers take them to security/hacking conferences instead of their main devices to prevent any potential exploits. This is because of the secure boot feature that prevents any changes to the computer's kernel and the restrictive ChromeOS does not let the user download any applications outside of the Google Play Store, access the command line, or gain root permissions. Great for security, terrible for development. This guide is designed to help you use a chromebook to set up a development environment for the Cryptoeconomics.Study course. Choose your own adventure.

<br />

## The Recommended Way

This section will help you navigate [Google Cloud](https://cloud.google.com/), take advantage of their [free and promotional offers](https://cloud.google.com/free/), and take the course without having to buy a new computer.

Since you have a chromebook we assume that you also have a Google account. If you haven't already set up a Google Cloud account, you can do so by visiting [Google Cloud](https://cloud.google.com). This will automatically set up your Google account and potentially even give you some free credits! You can also opt to use their free tier services, which are sufficient to complete the Cryptoeconomics.Study coding challenges.

After logging in you'll need to create a virtual machine on Google's servers. This will give you a machine that you can use to download the programs and files needed for the coding challenges. Best of all, these programs will be in an isolated container that will not affect the security or configuration of your chromebook at all. You'll also be able to take snapshots of your VM (virtual machine) so that you can always revert back to a previous state in case you download the wrong things or accidentally misconfigure permissions/ownership or whatnot. This allows you to experiment and learn without sacrificing the security of your main device and with the option to quickly roll back to previous states in the event of a mistake.

There are lots of options for Google Cloud VMs. We recommend [Ubuntu](https://www.ubuntu.com/) because it has lots of documentation and support. If you have questions or encounter problems, it will be much easier to fix them if you're on Ubuntu. The coding challenges for Cryptoeconomics.Study are lightweight, so the free or basic tiers should be fine. For storage you'll probably need about 10gb to download the programs for your dev environment. It's also very possible to set up your environment to use less space, but 10gb should be good.

After you've got your VM configured and created you'll have the option to open a terminal in the browser to view the output. This is great because A) you don't have to manage any of the complexity of SSH keys/tunneling and B) it gives you access to a terminal and full VM right in the tab of your chromebook browser. You can then use the command line to download all the packages you need. For an IDE we recommend VIM since it will work right there in the browser tab. More details on VIM can be found in the main development setup guide.

<br />

## The Insecure Way

> ⚠️ This will delete all data on your chromebook and completely reset it without many of the restrictions of ChromeOS.

This guide will help you enable [developer mode]() and install [crouton](). This downgrades you from the most secure OS on the market to a completely insecure and open linux build (not recommended). In the process you will also gain full command over the root user and be able to access the command line, dual boot linux, and install whatever you want.

### Enable Developer Mode
- [WikiHow](https://www.wikihow.com/Enable-Developer-Mode-on-a-Chromebook) - Explains how to enable developer mode with pictures (this deletes all data on the device).

### Installing Vanilla Crouton

Crouton is a flavor of Linux customized for chromebooks.
- [Crouton Github Repo](https://github.com/dnschneid/crouton) - All the information you need to enable developer mode and activate Crouton.

### Dual Booting Ubuntu and ChromeOS
- [Official Ubuntu Tutorial](https://tutorials.ubuntu.com/tutorial/install-ubuntu-on-chromebook#0) - short and to the point.
- [Linux Uprising Tutorial](https://www.linuxuprising.com/2018/12/how-to-install-ubuntu-linux-on-any.html) - more detailed than the Ubuntu tutorial.

<br />

## The Other Way

> ⚠️ This will delete all data on your chromebook. It could potentially also brick your machine and/or cause irreversible damage. Common problems include, but are not limited to: keyboard, trackpad, screen, audio, and touchscreen glitches.

While ChromeOS is super secure, at the end of the day it's just an OS. If you want you can remove it and install whatever Linux build you want. This usually involves physically taking apart the computer, removing a few screws, and installing a new OS from scratch. Before you start make sure that you have another computer around to download the new OS, format it into a bootable USB, and access the internet to trouble shoot any snafus along the if/when your chromebook is unresponsive! With that in mind, here's a few resources to help you get started. Good luck.
- [Create a bootable Ubuntu USB](https://tutorials.ubuntu.com/) - search "bootable USB" to find the instructions for your OS (Windows, OSX, and Ubuntu are supported). If you choose Ubuntu we highly recommend the "minimal setup," esp for devices with low storage, memory, or compute resources.
- [Create a bootable Fedora USB](https://fedoramagazine.org/make-fedora-usb-stick/) - Fedora magazine guide.
- [Lubuntu](https://lubuntu.net/) - like Ubuntu, but lighter (great for resource constrained devices like chromebooks).
- [Disable write protect at the hardware level](https://www.reddit.com/r/chromeos/search/?q=disable%20write%20protect&restrict_sr=1) - required before you can modify firmware.
- [MrChromeBox](https://mrchromebox.tech/) - instructions to enable developer mode, download and update firmware, and boot to a new OS.

<br />

## Technical Difficulties?

### Reach out to the community :)

Often the first steps are the hardest and we want to make sure you have a great experience learning about cryptoeconomics. If you get stuck or encounter difficulty setting up your development environment please [reach out to the community](https://forum.cryptoeconomics.study/t/technical-difficulties-thread/512). Chances are you're not the only one experiencing difficulties. Reaching out allows us to
- solve your problem directly
- document what the problem was and how we solved it so that in the future people can find those answers quickly
- understand the problem and improve the course material so that it's more intuitive for everyone
It's a win for everyone! So if you get stuck, don't worry about it. Just post your problem on the community forum [technical difficulties thread](https://forum.cryptoeconomics.study/t/technical-difficulties-thread/512) and we'll do our best to help :)

<br />
