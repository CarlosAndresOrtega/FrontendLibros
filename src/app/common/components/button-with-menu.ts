import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'button-with-menu',
    standalone: true,
    imports: [CommonModule, ButtonModule, RippleModule, StyleClassModule],
    template: `
        <div class="button-with-menu-container relative">
            <!-- Trigger Button -->
            <button
                pButton
                pRipple
                [icon]="buttonIcon"
                [label]="buttonLabel"
                [class]="buttonClass"
                [severity]="buttonSeverity"
                [text]="buttonText"
                [rounded]="buttonRounded"
                pStyleClass="@next"
                enterFromClass="!hidden"
                enterActiveClass="animate-scalein"
                leaveToClass="!hidden"
                leaveActiveClass="animate-fadeout"
                [hideOnOutsideClick]="true"
                [style]="buttonStyle"
            ></button>

            <!-- Dropdown Menu -->
            <ul class="dropdown-menu !p-4 !hidden rounded shadow-md !bg-white dark:!bg-surface-800 absolute right-0 z-50 min-w-[240px]">
                <li *ngFor="let item of menuItems" role="menuitem" class="!m-0 !mb-3 last:!mb-0">
                    <a
                        href="{{ item.url || '#' }}"
                        class="flex items-center hover:text-primary-500 duration-200 p-2 rounded-md"
                        pStyleClass="@grandparent"
                        enterFromClass="!hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="!hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                        (click)="handleMenuItemClick($event, item)"
                    >
                        <i *ngIf="item.icon" class="{{ item.icon }} mr-2"></i>
                        <span>{{ item.label }}</span>
                    </a>
                </li>
            </ul>
        </div>
    `,
    styles: [
        `
            .dropdown-menu {
                top: calc(100% + 0.5rem);
            }

            :host {
                display: block;
            }

            .animate-scalein {
                animation: scalein 0.15s ease-in;
            }

            .animate-fadeout {
                animation: fadeout 0.15s ease-out;
            }

            @keyframes scalein {
                0% {
                    opacity: 0;
                    transform: scale(0.8);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @keyframes fadeout {
                0% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                }
            }
        `,
    ],
})
export class ButtonWithMenu {
    // Button inputs
    @Input() buttonLabel: string = '';
    @Input() buttonIcon: string = '';
    @Input() buttonClass: string = 'text-surface-500 dark:text-surface-400';
    @Input() buttonSeverity: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined = 'secondary';
    @Input() buttonText: boolean = true;
    @Input() buttonRounded: boolean = true;
    @Input() buttonStyle: any = '';

    // Menu items
    @Input() menuItems: MenuItem[] | undefined = [];

    /**
     * Handle clicks on menu items
     */
    handleMenuItemClick(event: MouseEvent, item: MenuItem): void {
        // If item has a command, execute it
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item,
            });
        }

        // If the item has a url, let the browser handle navigation
        // If not, prevent default behavior
        if (!item.url) {
            event.preventDefault();
        }

        // If item is disabled, prevent action
        if (item.disabled) {
            event.preventDefault();
        }
    }
}
