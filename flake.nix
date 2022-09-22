{
  description = "pl-mobile-sales-order";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/master";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShell = pkgs.mkShell {
        nativeBuildInputs = [ pkgs.bashInteractive ];
        buildInputs = with pkgs; [
          nodejs-16_x
          nodePackages.yarn
          nodePackages.prettier
          nodePackages.typescript
          tmux
        ];
        shellHook = with pkgs; ''
          export PATH=~/.local/share/npm-packages/bin:$PATH
          export NODE_PATH=~/.local/share/npm-packages/lib/node_modules
        '';
      };
    });
}
